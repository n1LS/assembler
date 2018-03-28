class Instruction {

    constructor(opcode, value_a, value_b) {
        this.read_flag = -1
        this.write_flag = -1
        this.execution_flag = -1
        
        this.op = Opcode.from_code(opcode)

        this.a = value_a ? value_a : new Value(0, default_address_mode)
        this.b = value_b ? value_b : new Value(0, default_address_mode)

        if (!this.op.operands_valid(this.a, this.b)) {
            console.log('Invalid operands. Cannot create instruction!')
            throw 'InstructionInvalidError';
        }        
    }

    copy() {
        var a = new Value(this.a.value, this.a.mode)
        var b = new Value(this.b.value, this.b.mode)
        var i = new Instruction(this.op.opcode, a, b)

        return i;
    }

    execute(address, ram) {
        // execute
        return this.op.implementation(this, address, ram)
    }

    //* boring io stuff ********************************************************

    to_string() {
        function padl(l, x) {
            var s = "" + x
            while (s.length < l) s = " " + s
            return s
        }

        var out = `${this.op.name} ${address_mode_name(this.a.mode)}${padl(kMAX_ADDRESS_WIDTH, this.a.value)} ${address_mode_name(this.b.mode)}${padl(kMAX_ADDRESS_WIDTH, this.b.value)}`

        return out
    }

    to_short_string() {
        var out = this.op.short_name
        
        out += addr_names.get(this.a.mode).run + i2s_s(this.a.value, 4)
        out += addr_names.get(this.b.mode).run + i2s_s(this.b.value, 4)

        return out
    }

}