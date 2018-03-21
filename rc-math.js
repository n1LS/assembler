const b64_encoding = '0123456789DmnYjzdCiV;>]NZR^($Qb%{LAalTfOKvk/,IEwJ&?S_uG-}*=.oMgUys#dCiVBq:xpceP|htW@+FX)H[<r'
const b64_len = b64_encoding.length

function i2s_s(value, length) {
    if (typeof length === 'undefined') { length = 0; }
    const sign = (value < 0 ? 'v' : '^')
    value = value < 0 ? -value : value;
    return sign + i2s(value, length)
}

function i2s(i, length) {
    if (typeof length === 'undefined') { length = 0; }
    
    var s = ''

    while (i > 0 || length > s.length) {
        s = b64_encoding.charAt(i % b64_len) + s 
        i = Math.floor(i / b64_len)
    }
    
    return s;
}

function s2i(s) {
    var i = 0

    while (s.length) {
        i = i * b64_len + b64_encoding.indexOf(s.charAt(0))
        s = s.substr(1, s.length - 1)
    }

    return i
}