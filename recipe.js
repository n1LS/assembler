//@import rc-core.js
//@import rc-zeus.js
//@import rc-math.js
//@import rc-classes.js
//@import rc-assembler.js
//@import rc-instruction.js
//@import rc-preprocessor.js
//@import rc-address-modes.js
//@import rc-instruction-set.js

const environment = new Environment()

function clock(start) {
    if (!start) {
        return process.hrtime()
    }

    var end = process.hrtime(start)
    return Math.round((end[0] * 1000) + (end[1] / 1000000))
}

var code_1 = 
`;name dwarf 
 ADD #4, 3
 MOV 2, @2
 JMP -2
`
var code_2 = 
`;name stone
    MOV <2, 3        
    ADD 3, -1
    JMP -2, 0
    DAT #0, #0
    DAT #-5084, #5084
`
var code_for = 
`;name for
;name dbldwarf
;assert 1

        DAT             #-0001
        SUB #00005,   -0001
        MOV #00000,  @-0002
        JMP  -0002        
        DAT          #0000
start   SPL  -0004,   #-1     
        ADD #00005,   -0002
        MOV #00000,  @-0003
        JMP  -0002        
        END  start     

`
/* zeus test
const zeus = new Zeus(new Environment())

zeus.load_code(code_2)
zeus.load_code(code_1)

const start = clock()
const cycles = zeus.run()
const duration = ~~clock(start)
const mips = ~~((cycles / 10) / duration) / 100

console.log(`Ran ${cycles} cycles in ${duration} ms, ${mips} MIPS.`)
*/

const preprocessor = new Preprocessor()
const out = preprocessor.preprocess(code_for, new Environment())

console.log('ERRORS:')
console.log(out.errors.join('\n'))
console.log('WARNINGS:')
console.log(out.warnings.join('\n'))
console.log('CODE:')
console.log(out.code)
console.log('')

// done
'🎉  Done. No crash. Yay!'

