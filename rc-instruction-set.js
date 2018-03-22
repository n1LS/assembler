class Opcode {

    constructor(name, short_name, id, num_params, forks, a_modes, b_modes, implementation) {
        this.opcode = id
        this.num_params = num_params
        this.name = name
        this.forks = forks
        this.short_name = short_name
        this.a_modes = a_modes
        this.b_modes = b_modes

        this.implementation = implementation
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
                console.log(`Invalid op code / address mode combination in B operand ${this.name} B: ${address_mode_name(b.mode)}`)
                return false
            }
        }

        return true
    }

    static op_from_code(code) {
        // TODO replace with static opcode->op map
        for (var o = 0; o < opcodes.length; o++) {
            if (opcodes[o].opcode == code) {
                return opcodes[o]
            }
        }

        return null
    }

}

var opcodes = [
    //          ┌┬┬───────────────────────────────────────────────────────────> long version opcode
    //          │││    ┌──────────────────────────────────────────────────────> short version opcode
    //          │││    │   ┌┬┬────────────────────────────────────────────────> opcode name (value indifferent)
    //          │││    │   │││       ┌────────────────────────────────────────> number of parameters required
    //          │││    │   │││       │  ┌┬┬┬┬─────────────────────────────────> spawns new thread?
    //          │││    │   │││       │  │││││    ┌┬┬┬┬┬┬┬─────────────────────> address modes for A operand (____<#@$)
    //          │││    │   │││       │  │││││    ││││││││    ┌┬┬┬┬┬┬┬─────────> address modes for B operand (____<#@$)
    //          │││    │   │││       │  │││││    ││││││││    ││││││││  ┌┬┬┬───> implementation of this opcode
    new Opcode('DAT', 'D', DAT = 10, 2, false, 0b00000101, 0b00000101, Instruction.prototype.DAT ),
    new Opcode('MOV', 'M', MOV = 13, 2, false, 0b00001111, 0b00001011, Instruction.prototype.MOV ),
    new Opcode('ADD', 'A', ADD = 02, 2, false, 0b00001111, 0b00001011, Instruction.prototype.ADD ),
    new Opcode('NOP', 'O', NOP = 11, 0, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('JMP', 'J', JMP = 04, 1, false, 0b00001111, 0b00001011, Instruction.prototype.JMP ),
    new Opcode('FRK', 'F', FRK = 94, 1, true,  0b00001111, 0b00001011, Instruction.prototype.FRK ),
    
    new Opcode('SUB', 'S', SUB = 75, 2, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('JMZ', 'Z', JMZ = 49, 2, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('JMN', 'N', JMN = 33, 2, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('CMP', 'C', CMP = 07, 2, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('SLT', 'S', SLT = 78, 2, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
    new Opcode('DJN', 'D', DJN = 09, 1, false, 0b00001111, 0b00001011, Instruction.prototype.NOP ),
]