class Instruction {

    constructor(opcode, value_a, value_b) {
        this.opcode = opcode
        this.process = -1

        if (value_a != null) {
            this.a = value_a
        } else {
            this.a = new Value(0, addr_immediate)
        }

        if (value_b != null) {
            this.b = value_b
        } else {
            this.b = new Value(0, addr_immediate)
        }

        const op = op_from_code(this.opcode)

        if (!op.operands_valid(this.a, this.b)) {
            console.log('Invalid openrands. Cannot create instruction!')
            throw 'InstructionInvalidError';
        }        
    }

    to_string() {
        var op = op_from_code(this.opcode)
        var out = op.name

        if (op.num_params > 0) {
            out += ' ' + address_mode_name(this.a.mode) + this.a.value
        }

        if (op.num_params > 1) {
            out += ' ' + address_mode_name(this.b.mode) + this.b.value
        }

        while (out.length < 20) {
            out += ' '
        }

        return out
    }

    to_short_string() {
        var op = op_from_code(this.opcode)
        var out = op.short_name
        
        out += addr_names.get(this.a.mode).run + i2s_s(this.a.value, 4)
        out += addr_names.get(this.b.mode).run + i2s_s(this.b.value, 4)

        return out
    }

    clone() {
        var a = new Value(this.a.value, this.a.mode)
        var b = new Value(this.b.value, this.b.mode)
        var i = new Instruction(this.opcode, a, b)

        i.process = this.process

        return i;
    }

}