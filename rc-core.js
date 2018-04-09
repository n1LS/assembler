class ALU {

    constructor() {

    }

    static normalize(address) {
        return (kCORE_MEMORY_SIZE_UPPER + address) % kCORE_MEMORY_SIZE
    }
}

Array.prototype.write = function(index, value) {
    this[index] = value;
  }
  
  Array.prototype.read = function(index, value) {
    this[index] = value;
  }
  

class RAM {

    constructor() {
        this.memory = new Array(kCORE_MEMORY_SIZE)
        this.current_process_index = -1
        
        this.init_memory();
    }

    init_memory() {
        for (var a = 0; a < kCORE_MEMORY_SIZE; a++) {
            this.memory[a] = new Instruction(DAT, null, null)
        }
    }

    r(address) {
        if (address < 0 || address >= kCORE_MEMORY_SIZE || address === undefined) {
            console.log(`Address ${address} out of bound [0..${kCORE_MEMORY_SIZE}]`)
        }

        this.memory[address].read_flag = this.current_process_index
        return this.memory[address]
    }
    
    w(address, instruction) {
        this.memory[address] = instruction
        this.memory[address].write_flag = this.current_process_index
    }
    
}

class Core {
    
    constructor() {
        this.cu = new ControlUnit()
        this.ram = new RAM()
        this.processes = new Array()
        
        this.set_current_process_index(0)
        this.cycle = 0
        this.active = true
    }

    set_current_process_index(i) {
        this.current_process_index = i
        this.ram.current_process_index = i
    }

    reset() {
        this.processes = []
        this.RAM.init_memory()
    }

    load_program(program, address) {
        const pid = this.processes.length
        this.ram.current_process_index = pid

        for (var a = 0; a < program.instructions.length; a++) {
            this.ram.w(a + address, program.instructions[a])
        }

        this.processes[pid] = new Process()
        this.processes[pid].push(address + program.load_address)
    }

    current_process() {
        return this.processes[this.current_process_index]
    }

    step() {
        // run the currently selected thread
        this.cycle++

        if (this.processes.length) {
            // get next instruction address
            const addr = this.current_process().pop();

            // fetch and execute
            this.step_instruction(addr)

            // prepare next cycle process
            this.set_current_process_index((1 + this.current_process_index) % this.processes.length)
        }

        return this.active
    }

    step_instruction(address) {
        // INSTRUCTION FETCH executes all pre/post-inc/decrements
        const instruction = this.cu.fetch(address, this.ram)
        
        if (instruction === undefined) {
            throw 'MemoryCorruptedException'
        }

        // special handling for the for opcodes that spawn new threads
        if (instruction.op.forks) {
            this.current_process().push(ALU.normalize(address + 1))
        }
        
        // INSTRUCTION EXECUTION returns the next program counter
        this.ram.memory[address].execution_flag = this.current_process_index
        var next_pc = instruction.execute(address, this.ram)

        if (next_pc != null) {
            next_pc = ALU.normalize(address + next_pc)

            this.current_process().push(next_pc)
        }
        else {
            // instruction could not be executed and returned null
            
            const id = this.current_process_index
            const ts = this.current_process().num_threads()

            if (ts > 0) {
                console.log(`Status: Process #${id} lost a thread and is down to ${ts}`)
            } else {
                console.log(`Status: Process #${id} died on '${instruction}' at ${address}`)

                // remove process
                this.processes.splice(id, 1)

                if (id >= this.processes.length) {
                    this.set_current_process_index(0)
                }

                if (this.processes.length == 1) {
                    // we have a winner, print name: TODO
                    console.log(`End of Game: Process #${0} wins after ${this.cycle} cycles`)
                    this.active = false;
                }
            }
        }
    }

    /* UI IO stuff that kinda needs to be moved out of here *******************/

    next_instruction() {
        return this.ram.memory[this.current_process().next()]
    }

    dump() {
        return this.memory_dump(0, kCORE_MEMORY_SIZE)
    }

    print_memory(start, end) {
        console.log(this.memory_dump(start, end).join('\n'))
    }

    memory_dump(start, end) {
        function padln(num, count) {
            num = '' + num
        
            while (num.length < count) {
                num = '0' + num
            }
        
            return num
        }

        var output = new Array()

        for (var a = start; a < end; a++) {
            var addr = ALU.normalize(a)
            var i = this.ram.memory[addr]
            var out = padln(addr, kMAX_ADDRESS_WIDTH - 1) + ' ' + i.to_string()
            output.push(out)
        }

        return output
    }
}