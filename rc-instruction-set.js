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

    SPL(instruction, address, ram) {
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

    SUB(instruction, address, ram) {
        if (instruction.a.mode == addr_immediate) {
            const dst = instruction.b.pointer
            const ins = ram.r(dst)
            ins.b.value -= instruction.a.value
            ram.w(dst, ins)
        }
        else {
            const dst_address = instruction.b.pointer

            const src = ram.r(instruction.a.pointer)
            const dst = ram.r(dst_address)
            
            dst.a.value = ALU.normalize(dst.a.value - src.a.value)
            dst.b.value = ALU.normalize(dst.b.value - src.b.value)

            ram.w(dst_address, dst)
        }
        
        return 1
    }

    CMP(instruction, address, ram) {
        if (instruction.a.mode == addr_immediate) {
            const A = instruction.a.value
            const B = ram.r(instruction.b.pointer).b.value

            return (A == B) ? 2 : 1
        }

        // compare entire instruction

        var A = ram.r(instruction.a.pointer)
        var B = ram.r(instruction.b.pointer)
        
        return A.is_equal(B) ? 2 : 1
    }
    
    SLT(instruction, address, ram) {
        if (instruction.a.mode == addr_immediate) {
            const A = instruction.a.value
            const B = ram.r(instruction.b.pointer).b.value

            return (A < B) ? 2 : 1
        }

        var A = ram.r(instruction.a.pointer).b.value
        var B = ram.r(instruction.b.pointer).b.value
        
        return (A < B) ? 2 : 1
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
    new Opcode('SUB', 'S', SUB = 15, 2, false, 0b00001111, 0b00001011, Opcode.prototype.SUB ),
    new Opcode('JMP', 'J', JMP = 04, 1, false, 0b00001111, 0b00001011, Opcode.prototype.JMP ),
    new Opcode('JMZ', 'Z', JMZ = 19, 2, false, 0b00001111, 0b00001011, Opcode.prototype.JMZ ),
    new Opcode('JMN', 'N', JMN = 12, 2, false, 0b00001111, 0b00001011, Opcode.prototype.JMN ),
    new Opcode('CMP', 'C', CMP = 07, 2, false, 0b00001111, 0b00001111, Opcode.prototype.CMP ),
    new Opcode('SLT', 'L', SLT = 11, 2, false, 0b00001111, 0b00001011, Opcode.prototype.SLT ),
    new Opcode('DJN', 'D', DJN = 09, 2, false, 0b00001111, 0b00001111, Opcode.prototype.DJN ),
    new Opcode('SPL', 'F', SPL = 03, 1, true,  0b00001111, 0b00001011, Opcode.prototype.SPL ),
    
    /* ICWS '94
    new Opcode('NOP', 'O', NOP = 11, 0, false, 0b00001111, 0b00001011, Opcode.prototype.NOP ),
    new Opcode('MUL', 'M', SUB = 23, 2, false, 0b00001111, 0b00001011, Opcode.prototype.MUL ),
    new Opcode('DIV', 'V', SUB = 37, 2, false, 0b00001111, 0b00001011, Opcode.prototype.DIV ),
    new Opcode('MOD', 'R', SUB = 63, 2, false, 0b00001111, 0b00001011, Opcode.prototype.MOD ),
    new Opcode('SEQ', 'Q', SEQ = 31, 2, false, 0b00001111, 0b00001011, Opcode.prototype.SEQ ),
    new Opcode('SNE', 'E', SNE = 31, 2, false, 0b00001111, 0b00001011, Opcode.prototype.SNE ),
    new Opcode('XCH', 'X', XCH = 12, 2, false, 0b00001111, 0b00001011, Opcode.prototype.XCH ),
    new Opcode('PCT', 'P', PCT = 44, 2, false, 0b00001111, 0b00001011, Opcode.prototype.PCT ),
    new Opcode('STP', 'W', STP = 55, 2, false, 0b00001111, 0b00001011, Opcode.prototype.STP ),
    new Opcode('LDP', 'G', LDP = 66, 2, false, 0b00001111, 0b00001011, Opcode.prototype.LDP ),
    */
]

const __op_from_code = new Map(opcodes.map(op => [op.opcode, op]))
const __op_from_name = new Map(opcodes.map(op => [op.name, op]))

// the following is not part of the instruction set itself, it's only used for
// testing the opcode array for obvious inconsistencies

function check_ops() {
    ops = []

    for (var o = 0; o < opcodes.length; o++) {
        const op = opcodes[o]

        if (ops.includes(op.opcode)) {
            throw `DuplicateOpCode${op.opcode}Error`
        }
        else {
            ops.push(op.opcode)
        }

        if (op.implementation === undefined) {
            throw `OpImplementationMissingForOp${op.name}`
        }
    }        
}

check_ops()