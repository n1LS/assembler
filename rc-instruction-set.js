class Opcode {

    constructor(name, short_name, id, num_params, a_modes, b_modes) {
        this.opcode = id
        this.num_params = num_params
        this.name = name
        this.short_name = short_name
        this.a_modes = a_modes
        this.b_modes = b_modes
    }

    operands_valid(a, b) {
        const num_params = (a != null ? 1 : 0) + (b != null ? 1 : 0)

        // check number of parameters

        if (num_params < this.num_params) {
            console.log('Invalid number of parameters')
            return false
        }

        // check address modes

        if (this.num_params > 0) {
            if ((a.mode & this.a_modes) == 0) {
                console.log('Invalid op code / address mode combination in A operand')
                return false
            }
        }

        if (this.num_params > 1) {
            if ((b.mode & this.b_modes) == 0) {
                console.log('Invalid op code / address mode combination in B operand')
                return false
            }
        }

        return true
    }

}

var opcodes = [
    //         ┌┬┬────────────────────────────────────────────────────────────> long version opcode
    //         │││     ┌──────────────────────────────────────────────────────> short version opcode
    //         │││     │   ┌┬┬────────────────────────────────────────────────> opcode name (value indifferent)
    //         │││     │   │││       ┌────────────────────────────────────────> number of parameters required
    //         │││     │   │││       │    ┌┬┬┬┬┬┬┬────────────────────────────> address modes for A operand (____<#@$)
    //         │││     │   │││       │    ││││││││    ┌┬┬┬┬┬┬┬────────────────> address modes for B operand (____<#@$)
    new Opcode('DAT', 'D', DAT = 10, 2, 0b00000101, 0b00000101),
    new Opcode('MOV', 'M', MOV = 13, 2, 0b00001111, 0b00001011),
    new Opcode('ADD', 'A', ADD = 02, 2, 0b00001111, 0b00001011),
    new Opcode('SUB', 'S', SUB = 75, 2, 0b00001111, 0b00001011),
    new Opcode('JMP', 'J', JMP = 04, 1, 0b00001111, 0b00001011),
    new Opcode('JMZ', 'Z', JMZ = 49, 2, 0b00001111, 0b00001011),
    new Opcode('JMN', 'N', JMN = 33, 2, 0b00001111, 0b00001011),
    new Opcode('CMP', 'C', CMP = 07, 2, 0b00001111, 0b00001011),
    new Opcode('SLT', 'S', SLT = 78, 2, 0b00001111, 0b00001011),
    new Opcode('DJN', 'D', DJN = 09, 1, 0b00001111, 0b00001011),
    new Opcode('SPL', 'F', SPL = 94, 1, 0b00001111, 0b00001011),
    new Opcode('NOP', 'O', NOP = 11, 0, 0b00001111, 0b00001011),
]

function op_from_code(code) {
    for (var o = 0; o < opcodes.length; o++) {
        if (opcodes[o].opcode == code) {
            return opcodes[o]
        }
    }

    return null;
}