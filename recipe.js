//@import rc-core.js
//@import rc-math.js
//@import rc-classes.js
//@import rc-assembler.js
//@import rc-constants.js
//@import rc-instruction.js
//@import rc-preprocessor.js
//@import rc-address-modes.js
//@import rc-instruction-set.js

var core = new Core()

// load first program

var code_1 = 
`; dwarf 
 ADD #4, 3
 MOV 2, @2
 JMP -2
`
var program_1 = new Program(code_1)

core.load_program(program_1, 0, 4000)

// load second program

var code_2 = 
`; stone
    MOV <2, 3        
    ADD 3, -1
    JMP -2, 0
    DAT #0, #0
    DAT #-5084, #5084
`
/*
` ; imp
 mov 0 1
`
*/
var program_2 = new Program(code_2)

core.load_program(program_2, 1, 0)

// run run run

console.log(core.memory_dump(0, 20).join('\n'))
console.log()

var num_cycles = 1000000

console.log(`Running ${num_cycles} cycles...`)

var done = false

for (var i = 0; i < num_cycles; i++) {
    if (!core.step()) {
        break;
    }
}

console.log()
console.log(core.memory_dump(0, 20).join('\n'))

// done
'Done. No crash. Yay!'

