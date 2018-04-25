This is a massive WIP.

# Documentation

This is an attempt to keep things somewhat organized and well-defined in my own head.

# The language

_WorkingTitle_ is an assembly-type programming language inspired heavily by and based loosely on [redcode](http://corewar.co.uk/).

## Instruction set

### MOV A, B
Copy A-val to B-target
### ADD
ADD replaces the B-target with the sum of the A-value and the B-value
### JMP A
Continue execution at A
### SPL A
Fork a new thread at A

# Core & class structure

The `Core` class simulates the machine that runs the `programs`. Each programm runs as a `Process` that consists of at least one `Thread`.

The `Process` handles the thread-selection and keeps the program counter for each thread. It determines which instruction will be executed.

# Language improvements / add-ons

The entire code is structured in a way to make changes to the instruction set and adress modes (which pretty much covers all relevant changes) can be achieved with minimal changes in the code. At the moment the only files that need to be changed are listed below.

*Address mode changes*
* `rc-address-modes.js`: Contains the address mode listing and the ALU

*Instruction set changes*
* `rc-instruction-set.js`: Contains the definition of all instructions
* `rc-core.js`: The core implementation contains the jump table for the different instructions. This will extracted in the future.