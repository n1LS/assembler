const addr_names = new Map([
    [addr_direct          = 1 << 0, { display: '$', short: 'D' }],
    [addr_indirect        = 1 << 1, { display: '@', short: 'I' }],
    [addr_immediate       = 1 << 2, { display: '#', short: 'M' }],
    [addr_predecrement    = 1 << 3, { display: '<', short: 'P' }],
    [addr_postincrement   = 1 << 4, { display: '>', short: 'O' }],
    [addr_a_indirect      = 1 << 5, { display: '*', short: 'A' }],
    [addr_a_predecrement  = 1 << 6, { display: '{', short: 'Y' }],
    [addr_a_postincrement = 1 << 7, { display: '}', short: 'X' }],
])

// precalculated accessors
const default_address_mode   = addr_direct
const all_address_mode_names = Array.from(addr_names.values()).map(e => e.display).join('')
const default_data           = addr_names.get(default_address_mode).display + '0'

function address_mode_name(mode) {
    return addr_names.get(mode).display
}

// the Control Unit class is highly standard-specific, since it implements the 
// memory address modes

class ControlUnit {
    
    constructor() {
        this.instruction = null
    }

    resolve(value, address, ram) {
        switch (value.mode) {
            case addr_immediate:
                return 0

            case addr_direct:
                return value.value

            case addr_predecrement:
                var dst = ALU.normalize(value.value + address)
                var ins = ram.r(dst)
                ins.b.value = ALU.normalize(ins.b.value - 1)
                ram.w(dst, ins)
                return value.value + ins.b.value

            case addr_indirect:
                var dst = ALU.normalize(value.value + address)
                var ret = value.value + ram.r(dst).b.value
                return ret

            case addr_postincrement:
            case addr_a_indirect:
            case addr_a_predecrement:
            case addr_a_postincrement:
                throw 'NotYetImplementedException'
        }
    }

    fetch(address, ram) {
        var instruction = ram.r(address).copy()
        var a_pointer = this.resolve(instruction.a, address, ram)
        
        // cache a-target
        var a_dst = ALU.normalize(address + a_pointer)
        instruction.a_instruction = ram.r(a_dst).copy()

        var b_pointer = this.resolve(instruction.b, address, ram)

        instruction.a.pointer = a_dst
        instruction.b.pointer = ALU.normalize(address + b_pointer)
        
        return instruction
    }
    
}