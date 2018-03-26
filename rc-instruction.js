class Instruction {

    constructor(opcode, value_a, value_b) {
        this.read_flag = -1
        this.write_flag = -1
        this.execution_flag = -1
        
        this.opcode = opcode

        this.a = value_a ? value_a : new Value(0, default_address_mode)
        this.b = value_b ? value_b : new Value(0, default_address_mode)

        const op = Opcode.from_code(this.opcode)

        if (!op.operands_valid(this.a, this.b)) {
            console.log('Invalid operands. Cannot create instruction!')
            throw 'InstructionInvalidError';
        }        
    }

    copy() {
        var a = new Value(this.a.value, this.a.mode)
        var b = new Value(this.b.value, this.b.mode)
        var i = new Instruction(this.opcode, a, b)

        return i;
    }

    execute(address, ram) {
        // find operation
        const op = Opcode.from_code(this.opcode)

        // execute
        return op.implementation(this, address, ram)
    }

    //* boring io stuff ********************************************************

    to_string() {
        const op = Opcode.from_code(this.opcode)
        var out = op.name +
            ' ' + address_mode_name(this.a.mode) + this.a.value +
            ' ' + address_mode_name(this.b.mode) + this.b.value

        while (out.length < 20) {
            out += ' '
        }

        return out
    }

    to_short_string() {
        const op = Opcode.from_code(this.opcode)
        var out = op.short_name
        
        out += addr_names.get(this.a.mode).run + i2s_s(this.a.value, 4)
        out += addr_names.get(this.b.mode).run + i2s_s(this.b.value, 4)

        return out
    }

}