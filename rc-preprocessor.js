const kPSEUDO_OPCODES = ['END', 'EQU', 'ORG']

class Preprocessor {

    constructor() {
        this.warnings = null
        this.errors = null
        this.directions = null
    }

    strip_lines(lines) {
        // strip all non-code lines
        var i = 0
        var original_line = 0

        while (i < lines.length) {
            original_line++
            var line = lines[i]

            // strip all comments
            if (line.includes(';')) {
                line = line.substr(0, line.indexOf(';'))
            }

            // skip everything after 'END'
            if (line.trim() == 'END') {
                var l = lines.length - i - 1
                if (l) {
                    this.warnings.push(`W002: ${l} lines after END token`);
                }
                lines.splice(i + 1, l - 1)
                line = ''
            }

            if (line.trim().length) {
                // keep all good lines
                lines[i] = {
                    original_line: original_line,
                    line: 0,
                    text: line.trimRight()
                }

                i++

            } else {
                lines.splice(i, 1)
            }
        }
    }

    split_instructions(instructions, errors, warnings) {
        for (var i = 0; i < instructions.length; i++) {
            var o_l = instructions[i].original_line
            var ins = instructions[i].text
            var idx = instructions[i].line
            var items = ins.replace(',', ' ').replace(/\s+|\t+/g, ' ').split(' ')

            for (var q = items.length - 1; q >= 0; q--) {
                if (typeof items[q] == 'undefined') {
                    items.splice(q, 1)
                }
            }

            if (items.length < 2) {
                this.errors.push(`E001: Too few tokens on line ${o_l} '${ins}'`)
            }
            else {
                var op = null

                // find opcode
                for (var o = 0; o < opcodes.length; o++) {
                    if (opcodes[o].name == items[1]) {
                        op = opcodes[o]
                    }
                }
                
                if (op) {
                    if (items.length < 2 + op.num_params) {
                        this.errors.push(`E006: Too few tokens for opcode '${items[1]}' on line ${o_l} '${ins}'`)
                    }
                }
                else {
                    // pseudo-op?
                    if (!kPSEUDO_OPCODES.includes(items[1])) {
                        this.errors.push(`E003: Unknown opcode '${items[1]}' on line ${o_l} '${ins}'`)
                    }
                }
            }

            items[0] = this.make_valid_label(items[0])

            instructions[i] = {
                line: idx,
                original_line: o_l,
                instruction: items
            }
        }
    }

    join_instructions(instructions) {
        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            instructions[i] = ins.instruction.join('\t')
        }

        // insert all directions at the head
        instructions.splice(0, 0, ...this.directions)
    }

    make_valid_label(text) {
        // labels can only be upper-case letters 65 'A' - 90 'Z' and numbers 
        return text.replace(/[^\x41-\x5A_\x30-\x39]/g, '')
    }

    resolve_equs(equs, labels) {
        const self = this
        
        equs.forEach((value, key) => {
            equs.set(key, self.resolve_label(0, value, labels, equs))
        })
    }

    resolve_label(offset, text, labels, equs) {
        var keys = Array.from(labels.keys()).sort((a, b) => { 
            return b.length - a.length })

        keys.forEach(key => {
            while (text.includes(key)) {
                text = text.replace(key, `(${labels.get(key) - offset})`)
            }
        })

        var keys = Array.from(labels.keys()).sort((a, b) => { 
            return b.length - a.length })

        keys.forEach(key => {
            while (text.includes(key)) {
                text = text.replace(key, `(${equs.get(key)})`)
            }
        })

        return text
    }

    replace_labels(instructions) {
        // everything in column 1 is a label
        var labels = new Map()
        var equs = new Map()

        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var components = ins.instruction
            var label = this.make_valid_label(components[0])

            if (label.length) {
                // two kinds of labels - actual markers and EQU
                if (ins.instruction[1] == 'EQU') {
                    instructions[i] = null
                    
                    if (!equs.has(label)) {
                        equs.set(label, components[2])
                    } else {
                        this.warnings.push(`W004: Duplicate constant '${label}' in line ${ins.original_line}`)
                    }
                }
                else {
                    if (!labels.has(label)) {
                        labels.set(label, ins.line)
                    } else {
                        this.warnings.push(`W003: Duplicate label '${label}' in line ${ins.original_line}`)
                    }
                }
            }
        }

        instructions = instructions.filter(n => n != null); 

        this.resolve_equs(equs, labels)
        
        // now find components using these labels      
        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var comp = ins.instruction

            if (comp.length > 2) {
                comp[2] = this.resolve_label(ins.line, comp[2], labels, equs)
            }
            else {
                comp.push(default_dummy_data)
            }

            if (comp.length > 3) {
                comp[3] = this.resolve_label(ins.line, comp[3], labels, equs)
            }
            else {
                comp.push(default_dummy_data)
            }

            // strip label
            comp.splice(0, 1)
        }
    }

    number_lines(lines) {
        var counter = 0

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]
            var pseudo = false

            // check for pseudo op codes
            for (var p in kPSEUDO_OPCODES) {
                var p_op = kPSEUDO_OPCODES[p]

                if (line.instruction[1] == p_op) {
                    pseudo = true
                    break
                }
            }

            if (pseudo) {
                line.line = 0
            } else {
                line.line = counter;
                counter++
            }
        }
    }

    evaluate_address(address) {
        const valid_chars = all_address_mode_names + '()0123456789+-/*'
        
        // check if the only contents is now numberical + operand
        for (var i = 0; i < address.length; i++) {
            if (!valid_chars.includes(address.charAt(i))) {
                this.errors.push(`E002: Unknown label in address '${address}'`)
                return default_dummy_data;
            }
        }

        // evaluate math in address
        var prefix = address[0]
        var value = address

        if (all_address_mode_names.includes(prefix)) {
            value = address.substr(1, address.length)
        } else {
            prefix = addr_names.get(default_address_mode).display
        }

        return prefix + eval(value)
    }

    evaluate_addresses(instructions) {
        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var components = ins.instruction

            if (components.length > 1) {
                components[1] = this.evaluate_address(components[1])
            }

            if (components.length > 2) {
                components[2] = this.evaluate_address(components[2])
            }
        }
    }

    strip_to_ascii(code) {
        var len = code.length
        var ascii = code = code.replace(/[^\x00-\x7F]/g, '')
        var diff = len - ascii.length

        if (len != ascii.length) {
            this.warnings.push(`W001: ${diff} non-ASCII characters in input.`)
        }

        return ascii
    }

    preprocess(code) {
        var instructions = new Array()
        this.warnings = new Array()
        this.errors = new Array()
        this.directions = new Array()

        // strip all non-ascii characters
        code = this.strip_to_ascii(code)

        // split into array
        var components = code.toUpperCase().split('\n')

        // strip all non-code lines and turn the strings into [index, text] 
        // objects
        this.strip_lines(components)

        // split into quads
        this.split_instructions(components)

        // set correct addresses
        this.number_lines(components)

        // parse labels
        this.replace_labels(components)
        components = components.filter(n => n != null); 
        
        // evaluate address arithmetic
        this.evaluate_addresses(components)

        // put the components back together
        this.join_instructions(components)

        // join the lines
        var output = components.join('\n')

        return {
            code: output,
            errors: this.errors,
            warnings: this.warnings
        }
    }
}