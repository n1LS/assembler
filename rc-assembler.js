class Assembler {

    constructor() {
        this.warnings = null
        this.errors = null
    }

    address_mode(value) {
        if ('.0123456789-'.includes(value[0])) {
            this.errors.push(`E007: Implicit address mode is not supported.`)
            return addr_direct
        }
    
        var name = null
    
        addr_names.forEach((v, k) => {
            if (v.display == value) {
                name = k;
            }
        })
    
        return name
    }

    parse_instruction(input) {
        var bak = input
        var items = input.split('\t')
        
        // find correct opcode

        var op_string = items[0]
        var opcode = null

        for (var o = 0; o < opcodes.length; o++) {
            var op = opcodes[o]

            if (op.name == op_string) {
                opcode = op
                break
            }
        }

        if (opcode == null) {
            this.errors.push(`E003: Unknown opcode '${op_string}' in '${bak}'`)
            return null
        }

        // check if parameter count is correct/sufficient

        const has = items.length - 1
        const should = opcode.num_params
        if (has < should) {
            this.errors.push(`E004: Too few tokens (${has}/${should}) in '${bak}'`)
            return null
        }

        var values = [null, null]

        for (var t = 0; t < opcode.num_params; t++) {
            var comp = items[t + 1]
            var a = this.address_mode(comp[0])
            var v = parseInt(comp.substr(1, comp.length - 1))

            if (a == null) {
                this.errors.push(`E005: Unknown address mode ${comp} in '${bak}'`)
                return null
            }

            values[t] = new Value(v, a)
        }

        var i = new Instruction(opcode.opcode, values[0], values[1])

        return i
    }

    assemble(string) {
        this.warnings = new Array()
        this.errors = new Array()

        if (typeof string == 'undefined') {
            string = ''
        }
        
        var listing = new Array()
        var instructions = new Array()
        var components = string.split('\n')

        this.labels = new Map()

        for (var i = 0; i < components.length; i++) {
            var ins = this.parse_instruction(components[i])

            if (ins != null) {
                instructions.push(ins)
                listing.push(ins.to_short_string())
            } 
        }

        return {
            listing: listing.join('\n'),
            code: instructions,
            errors: this.errors,
            warnings: this.warnings
        }
    }
}

