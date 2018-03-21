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

var code_1 = " mov 0 1"
var program_1 = new Program(code_1)

core.load_program(program_1, 0, 0)

// load second program

var code_2 = " mov 0 1"
var program_2 = new Program(code_2)

core.load_program(program_2, 1, 10)

// run run run

console.log(core.memory_dump(0, 20).join("\n"))
console.log()

for (var i = 0; i < 100000000; i++) {
    core.step()
}

console.log(core.memory_dump(0, 20).join("\n"))

// done
"done. no crash."