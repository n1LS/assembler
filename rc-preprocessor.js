class Preprocessor {

    constructor() {
        this.warnings = null
        this.errors = null
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
                    this.warnings.push(`W002: ${l} line(s) after END token`);
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
            
            // fix label:
            ins = ins.replace(/^([^\s]+):/g, '$1 ')

            // fix end as label
            ins = ins.replace(/^END\s/g, '\tEND\t')

            // remove multiple spaces
            ins = ins.replace(/\s+|\t+/g, ' ')
            
            // try fixing "address mode space value"-issues like "dat # 3"
            const modes = Array.from(addr_names.values()).map(e => e.display)
            modes.forEach(mode => {
                var re = new RegExp(` \\${mode} `, 'g')
                ins = ins.replace(re, ` ${mode}`)
            })

            // there's a few options here. If there is no comma separating the 
            // operands, there cannot be any spaces in the command (spaces 
            // displayed as _ in the examples below):
            // mov_(1+label)_0         works (space as divider, no comma)
            // mov_(1_+_label),_0      works (comma as divider)
            // mov_(1_+_label)_0       fails (no comma but spaces)

            if (ins.includes(',')) {
                // comma separated -> X_Y_A,B
                var x = ins.indexOf(' ')
                ins = ins.substr(0, x) + ',' + ins.substr(x + 1)
                x = ins.indexOf(' ')
                ins = ins.substr(0, x) + ',' + ins.substr(x + 1)
                ins = ins.replace(/\s+/g, '')

                var items = ins.split(',')
            }
            else {
                // no comma -> split on space
                var items = ins.split(' ')
            }

            for (var q = items.length - 1; q >= 0; q--) {
                if (typeof items[q] == 'undefined') {
                    items.splice(q, 1)
                }
            }

            if (items.length > 1) {
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

                    // single operand? right align?
                    if (items.length == 3 && op.b_align) {
                        items.splice(2, 0, '0')
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
        const fixed = []
        var last = 0

        for (var i = 0; i < instructions.length; i++) {
            var line = instructions[i].instruction.join('\t')
            
            while (instructions[i].original_line > last + 1) {
                fixed.push('')
                last++
            }

            fixed.push(line)
            instructions[i] = line

            last++
        }

        return fixed
    }

    make_valid_label(text) {
        // labels can only be upper-case letters and numbers 
        return text.replace(/[^\x41-\x5A_\x30-\x39]/g, '')
    }

    resolve_equates() {
        const self = this
        
        this.equates.forEach((value, key) => {
            self.equates.set(key, self.resolve_label(0, value))
        })
    }

    resolve_label(offset, text) {
        var all = new Map()

        this.labels.forEach((value, key) => {
            all.set(key, value - offset)
        })

        this.equates.forEach((value, key) => {
            all.set(key, value)
        })

        all.set('CURLINE', offset)

        var idents = Array.from(all.keys()).sort((a, b) => { 
            return b.length - a.length 
        })

        idents.forEach(key => {
            const value = '' + all.get(key)

            if (!value.includes(key)) {
                while (text.includes(key)) {
                    text = text.replace(key, `(${value})`)
                }
            }
        })

        return text
    }

    replace_labels(instructions) {
        // everything in column 1 is a label

        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var components = ins.instruction
            var label = this.make_valid_label(components[0])

            if (label.length) {
                // two kinds of labels - actual markers and EQU
                if (ins.instruction[1] == 'EQU') {
                    instructions[i] = null
                    
                    if (!this.equates.has(label)) {
                        this.equates.set(label, components[2])
                    } else {
                        this.warnings.push(`W004: Duplicate constant '${label}' in line ${ins.original_line}`)
                    }
                }
                else {
                    if (!this.labels.has(label)) {
                        this.labels.set(label, ins.line)
                    } else {
                        this.warnings.push(`W003: Duplicate label '${label}' in line ${ins.original_line}`)
                    }
                }
            }
        }

        for (var n = instructions.length - 1; n >= 0; n--) {
            const ins = instructions[n]
            
            if (ins == null || ins.instruction.length == 1) {
                instructions.splice(n, 1)
            }
        }

        this.resolve_equates()
        
        // now find components using these labels      
        for (var i = 0; i < instructions.length; i++) {
            var ins = instructions[i]
            var comp = ins.instruction

            if (comp.length > 2) {
                comp[2] = this.resolve_label(ins.line, comp[2])
            }
            else {
                comp.push(default_data)
            }

            if (comp.length > 3) {
                comp[3] = this.resolve_label(ins.line, comp[3])
            }
            else {
                comp.push(default_data)
            }

            // strip label
            comp.splice(0, 1)
        }
    }

    solve_loop(lines, offset) {
        var for_op = lines.splice(0, 1)[0]
        lines.pop()

        const variable = for_op.instruction[0]
        var value = for_op.instruction[2]

        try {
            value = eval(this.resolve_label(offset, value))
        }
        catch (e) {
            this.errors.push(`E009: Unresolvable address '${value}' in loop`)
            return []
        }

        const regex = new RegExp(variable, 'gi');

        const output = []

        for (var i = 0; i < value; i++) {
            for (var r = 0; r < lines.length; r++) {
                var source = lines[r]

                var line = {
                    line: source.line,
                    original_line: source.original_line,
                    instruction: source.instruction.slice()
                }
                
                var ins = line.instruction.slice()
                var val = (i + 1) + ''
                
                // replace in label
                ins[0] = ins[0].replace(regex, val)
                // replace in values
                for (var x = 2; x < ins.length; x++) {
                    ins[x] = ins[x].replace(regex, val)
                }
                
                line.instruction = ins

                output.push(line);
            }
        }

        return output
    }

    evalulate_loop(lines, index) {
        var loop_end = index + 1
        var found = false

        // find matching ROF
        while (loop_end < lines.length) {
            const op = lines[loop_end].instruction[1]

            if (op == 'FOR') { 
                loop_end = this.evalulate_loop(lines, loop_end)
            }
            else if (op == 'ROF') {
                found = true
                break
            }

            loop_end++
        }

        if (found) {
            // we have a matching for-rof block with no further for/rof blocks
            // inside
            const loop = lines.splice(index, loop_end - index + 1)
            const resolved = this.solve_loop(loop, index)

            lines.splice.apply(lines, [index, 0].concat(resolved))
            
            // return next index to check
            return index + resolved.length
        }

        this.errors.push(`E001: Missing ROF for FOR in line ${lines[index].original_line}`)
        lines.splice(index, 1)
    }

    parse_loops(lines) {
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i]

            if (line.instruction[1] == 'FOR') {
                this.evalulate_loop(lines, i)
                i--
            }
        }
    }

    number_lines(lines) {
        var counter = 0

        for (var i = 0; i < lines.length; i++) {
            const line = lines[i]
            var pseudo = false

            if (line.instruction.length == 1) {
                // label only, count, but do not increase counter
                line.line = counter
                continue
            }

            // check for pseudo op codes
            if (kPSEUDO_OPCODES.includes(line.instruction[1])) {
                line.line = 0
                continue
            }

            line.line = counter;
            counter++
        }
    }

    evaluate_address(address) {
        const valid_chars = address_mode_names + '()0123456789+-/*%'
        
        // check if the only contents is now numberical + operand
        for (var i = 0; i < address.length; i++) {
            if (!valid_chars.includes(address.charAt(i))) {
                this.errors.push(`E002: Unknown label in address '${address}'`)
                return default_data;
            }
        }

        // evaluate math in address
        var prefix = address[0]
        var value = address

        if (address_mode_names.includes(prefix)) {
            value = address.substr(1, address.length)
        } else {
            prefix = addr_names.get(default_address_mode).display
        }

        // trim leading zeros (cause we allow them for some reason)
        value = value.replace(/^[-]?0+(?=\d)/, '')

        try {
            var v = eval(value)
        }
        catch (error) {
            this.errors.push(`E008: Unresolvable address '${value}'`)
        }

        if (isNaN(v)) {
            this.errors.push(`E010: Value '${value}' is not a number`)
        }

        // normalize the value
        v %= this.environment.core_size

        return prefix + v
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
        var ascii = code.replace(/[^\x00-\x7F]/g, '')
        var diff = len - ascii.length

        if (len != ascii.length) {
            this.warnings.push(`W001: ${diff} non-ASCII characters in input.`)
        }

        return ascii
    }

    extract_metadata(lines) {
        const metadata = new Map()

        for (var idx in lines) {
            const line = lines[idx].trim()
            if (line.length > 1 && line[0] === ';' && line[1] !== ' ' && 
                line.includes(' ') && (line.indexOf(' ') < line.length - 1)) {

                const items = line.split(' ')
                const key = items[0].substr(1)
                const value = items.splice(1).join(' ')

                metadata.set(key.toUpperCase(), value)
            }
        }

        return metadata
    }

    fill_environment_equates() {
        this.equates.set('CORESIZE', this.environment.core_size + '')
        this.equates.set('MAXLENGTH', this.environment.max_instructions + '')
        // TODO: missing constants
    }

    preprocess(code, environment) {
        this.environment = environment

        this.warnings = new Array()
        this.errors = new Array()
        
        this.labels = new Map()
        this.equates = new Map()
        
        var instructions = new Array()

        // get all environment constants
        this.fill_environment_equates()

        // strip all non-ascii characters
        code = this.strip_to_ascii(code)

        // split into array
        var components = code.toUpperCase().split('\n')

        // extract all comment-value meta data liens
        const metadata = this.extract_metadata(code.split('\n'))

        // strip all non-code lines and turn the strings into objects
        this.strip_lines(components)

        // split into quads
        this.split_instructions(components)

        // unroll for/rof
        this.parse_loops(components)

        // set correct addresses
        this.number_lines(components)

        // parse labels
        this.replace_labels(components)
        
        // evaluate address arithmetic
        this.evaluate_addresses(components)

        // put the components back together
        const fixed = this.join_instructions(components)
        const verbose = fixed.join('\n')

        // join the lines
        const output = components.join('\n')

        // todo add warnings for missing "obligatory" metadata (name, author, 
        // redode version)

        return {
            verbose_code: verbose,
            code: output,
            errors: this.errors,
            warnings: this.warnings,
            metadata: metadata,
        }
    }
}