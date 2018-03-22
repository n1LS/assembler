const addr_names = new Map([
    [addr_direct       = 1 << 0, { display: '$', run: 'D' }],
    [addr_indirect     = 1 << 1, { display: '@', run: 'I' }],
    [addr_immediate    = 1 << 2, { display: '#', run: 'M' }],
    [addr_predecrement = 1 << 3, { display: '<', run: 'P' }],
])

// precalculated accessors
const default_address_mode = addr_direct
const all_address_mode_names = Array.from(addr_names.values()).map(e => e.display).join('')
const default_dummy_data = addr_names.get(default_address_mode).display + '0'

function address_mode_name(mode) {
    if (addr_names.has(mode)) {
        return addr_names.get(mode).display
    }

    return '0'
}

// the ALU class is highly standard-specific, since it implements the memory 
// address modes

class ALU {
    
        constructor() {
        }

        pointer(value, address, memory) {
            switch (value.mode) {
                case addr_immediate:
                    return 0

                case addr_direct:
                    return value.value

                case addr_predecrement:
                    var dst = (value.value + address) % kCORE_MEMORY_SIZE
                    memory[dst].b.value--
                    return memory[dst].b.value

                case addr_indirect:
                    var dst = (value.value + address) % kCORE_MEMORY_SIZE
                    return value.value + memory[dst].b.value
            }
        }

        resolve(value, address, memory) {
            var dst = this.pointer(value, address, memory)
            return (dst + address) % kCORE_MEMORY_SIZE
        }
        
    }