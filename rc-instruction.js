class Instruction {

    constructor(opcode, value_a, value_b) {
        this.opcode = opcode
        this.process_id = -1

        this.a = value_a ? value_a : new Value(0, default_address_mode)
        this.b = value_b ? value_b : new Value(0, default_address_mode)

        const op = Opcode.op_from_code(this.opcode)

        if (!op.operands_valid(this.a, this.b)) {
            console.log('Invalid openrands. Cannot create instruction!')
            throw 'InstructionInvalidError';
        }        
    }

    copy() {
        var a = new Value(this.a.value, this.a.mode)
        var b = new Value(this.b.value, this.b.mode)
        var i = new Instruction(this.opcode, a, b)

        i.process_id = this.process_id

        return i;
    }

    execute(address, core) {
        this.a.pointer = core.alu.resolve(this.a, address, core.memory)
        this.b.pointer = core.alu.resolve(this.b, address, core.memory)

        const op = Opcode.op_from_code(this.opcode)
        return op.implementation(this, address, core)
    }

    //* boring io stuff ********************************************************

    to_string() {
        const op = Opcode.op_from_code(this.opcode)
        var out = op.name +
            ' ' + address_mode_name(this.a.mode) + this.a.value +
            ' ' + address_mode_name(this.b.mode) + this.b.value

        while (out.length < 20) {
            out += ' '
        }

        return out
    }

    to_short_string() {
        const op = Opcode.op_from_code(this.opcode)
        var out = op.short_name
        
        out += addr_names.get(this.a.mode).run + i2s_s(this.a.value, 4)
        out += addr_names.get(this.b.mode).run + i2s_s(this.b.value, 4)

        return out
    }

}