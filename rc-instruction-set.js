class Opcode {

    static from_code(code) {
        return __op_from_code.get(code)
    }

    static from_name(code) {
        return __op_from_name.get(code)
    }

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
                console.log('Invalid op code / address mode ' +
                    'combination in A operand')
                return false
            }
        }

        if (this.num_params > 1) {
            if ((b.mode & this.b_modes) == 0) {
                console.log(`Invalid op code / address mode combination in B ` +
                    `operand ${this.name} B: ${address_mode_name(b.mode)}`)
                return false
            }
        }

        return true
    }

    /* opcode instruction implementation **************************************/

    MOV(instruction, address, ram) {
        if (instruction.a.mode == addr_immediate) {
            // write a-val to b-target
            const dst_address = instruction.b.pointer
            const dst = ram.r(dst_address)
            dst.b.value = instruction.a.value
            ram.w(dst_address, dst)
        }
        else {
            // copy entire instruction
            const ins = ram.r(instruction.a.pointer).copy()
            ram.w(instruction.b.pointer, ins)
        }
        
        return 1
    }

    ADD(instruction, address, ram) {
        if (instruction.a.mode == addr_immediate) {
            const dst = instruction.b.pointer
            const ins = ram.r(dst)
            ins.b.value += instruction.a.value
            ram.w(dst, ins)
        }
        else {
            const dst_address = instruction.b.pointer

            const src = ram.r(instruction.a.pointer)
            const dst = ram.r(dst_address)
            
            dst.a.value = ALU.normalize(dst.a.value + src.a.value)
            dst.b.value = ALU.normalize(dst.b.value + src.b.value)

            ram.w(dst_address, dst)
        }
        
        return 1
    }

    JMP(instruction, address, ram) {
        return instruction.a.pointer - address
    }

    DAT(instruction, address, ram) {
        return null
    }

    NOP(instruction, address, ram) {
        return 1
    }

    FRK(instruction, address, ram) {
        return instruction.a.pointer
    }    

    DJN(instruction, address, ram) {
        const dst_address = instruction.b.pointer
        const dst = ram.r(dst_address)
        dst.b.value--
        ram.w(dst_address, dst)

        return (dst.b.value != 0) ? (instruction.a.pointer - address) : 1
    }

    JMZ(instruction, address, ram) {
        const dst = ram.r(instruction.b.pointer)

        return (dst.b.value == 0) ? (instruction.a.pointer - address) : 1
    }

    JMN(instruction, address, ram) {
        const dst = ram.r(instruction.b.pointer)

        return (dst.b.value != 0) ? (instruction.a.pointer - address) : 1
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
    new Opcode('DAT', 'D', DAT = 10, 2, false, 0b00000101, 0b00000101, Opcode.prototype.DAT ),
    new Opcode('MOV', 'M', MOV = 13, 2, false, 0b00001111, 0b00001011, Opcode.prototype.MOV ),
    new Opcode('ADD', 'A', ADD = 02, 2, false, 0b00001111, 0b00001011, Opcode.prototype.ADD ),
    new Opcode('NOP', 'O', NOP = 11, 0, false, 0b00001111, 0b00001011, Opcode.prototype.NOP ),
    new Opcode('JMP', 'J', JMP = 04, 1, false, 0b00001111, 0b00001011, Opcode.prototype.JMP ),
    new Opcode('FRK', 'F', FRK = 94, 1, true,  0b00001111, 0b00001011, Opcode.prototype.FRK ),
    new Opcode('DJN', 'D', DJN = 09, 1, false, 0b00001111, 0b00001011, Opcode.prototype.DJN ),
    new Opcode('JMZ', 'Z', JMZ = 49, 2, false, 0b00001111, 0b00001011, Opcode.prototype.JMZ ),
    new Opcode('JMN', 'N', JMN = 33, 2, false, 0b00001111, 0b00001011, Opcode.prototype.JMN ),
    
    new Opcode('SUB', 'S', SUB = 75, 2, false, 0b00001111, 0b00001011, Opcode.prototype.NOP ),
    new Opcode('CMP', 'C', CMP = 07, 2, false, 0b00001111, 0b00001011, Opcode.prototype.NOP ),
    new Opcode('SLT', 'S', SLT = 78, 2, false, 0b00001111, 0b00001011, Opcode.prototype.NOP ),
]

const __op_from_code = new Map(opcodes.map(op => [op.opcode, op]))
const __op_from_name = new Map(opcodes.map(op => [op.name, op]))