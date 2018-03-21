This is a massive WIP.

# Documentation

This is an attempt to keep things somewhat organized and well-defined in my own head.

# The language

_WorkingTitle_ is an assembly-type programming language inspired heavily and based loosely on [redcode](http://corewar.co.uk/).

## Instruction set

### MOV A, B
Copy A to B
### ADD
Add A to B, write result to B
### JMP A
Continue execution at A
### FRK A
Fork a new thread at A

# Core & class structure

The ```Core``` class simulates the machine that runs the ```programs```. Each programm runs as a ```Process``` that consists of at least one ```Thread```.

The ```Process``` handles the thread-selection and keeps the program counter for each thread. It determines which instruction will be executed.