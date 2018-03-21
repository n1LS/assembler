const addr_names = new Map([
    [addr_direct       = 1 << 0, { display: '$', run: 'D' }],
    [addr_indirect     = 1 << 1, { display: '@', run: 'I' }],
    [addr_immediate    = 1 << 2, { display: '#', run: 'M' }],
    [addr_predecrement = 1 << 3, { display: '<', run: 'P' }],
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