class Preprocessor {

    constructor() {
        this.warnings = null
        this.errors = null
        this.directions = null
    }

    strip_lines(lines) {
        // strip all non-code lines
        var i = 0
        var line = 0

        while (i < lines.length) {
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
                lines.splice(i, l)
                line = ''
            }

            if (line.trim().length) {
                // keep all good lines
                lines[i] = {
                    original_line: i,
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
                        this.errors.push(`E006: Too few tokens for opcode '${items[1]}' line ${o_l} '${ins}'`)
                    }
                }
                else {
                    // pseudo-op?
                    if (!kPSEUDO_OPCODES.includes(items[1])) {
                        this.errors.push(`E003: Unknown opcode '${items[1]} on line ${o_l} '${ins}'`)
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
        // labels can only be upper-case letters 65 'A' - 90 'Z'
        return text.replace(/[^\x41-\x5A_]/g, '')
    }

    resolve_label(offset, text, labels) {
        labels.forEach(function (value, key) {
            if (text.includes(key)) {
                text = text.replace(key, value - offset)
            }
        })

        return text
    }

    replace_labels(instructions) {
        // everything in column 1 is a label
        var labels = new Map()

        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var components = ins.instruction
            var label = this.make_valid_label(components[0])

            if (label.length) {
                if (!labels.has(label)) {
                    labels.set(label, ins.line)
                } else {
                    this.warnings.push(`W003: Duplicate label '${label}' in line ${ins.original_line}`)
                }
            }
        }

        // now find components using these labels      
        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var comp = ins.instruction

            if (comp.length > 2) {
                comp[2] = this.resolve_label(ins.line, comp[2], labels)
            }
            else {
                comp.push(default_dummy_data)
            }

            if (comp.length > 3) {
                comp[3] = this.resolve_label(ins.line, comp[3], labels)
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
        // check if the only contents is now numberical + operand
        for (var i = 0; i < address.length; i++) {
            const valid_chars = all_address_mode_names + '0123456789+-/*'

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