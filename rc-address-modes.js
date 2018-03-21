var c = 0

const addr_direct       = c++
const addr_immediate    = c++
const addr_indirect     = c++
const addr_predecrement = c++

const addr_names = new Map([
    [addr_direct,       { display: '$', run: 'D' }],
    [addr_immediate,    { display: '#', run: 'M' }],
    [addr_indirect,     { display: '@', run: 'I' }],
    [addr_predecrement, { display: '<', run: 'P' }],
])

// precalculated accessors
const default_address_mode = addr_direct
const all_address_mode_names = Array.from(addr_names.values()).map(e => e.display).join("")
const default_dummy_data = addr_names.get(default_address_mode).display + "0"

function address_mode_name(mode) {
    if (addr_names.has(mode)) {
        return addr_names.get(mode).display
    }

    return "?"
}