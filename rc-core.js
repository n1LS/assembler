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


        for (var i = 0; i < kNUM_PROGRAMS; i++) {
            this.processes.push(new Process())
        }
    }

    set_current_process_index(i) {
        this.current_process_index = i
        this.ram.current_process_index = i
    }

    load_program(program, process_id, address) {
        this.ram.current_process_index = process_id

        for (var a = 0; a < program.instructions.length; a++) {
            this.ram.w(a + address, program.instructions[a])
        }

        this.processes[process_id].pop_all()
        this.processes[process_id].push(address  + program.load_address)

        this.ram.current_process_index = this.current_process_index
    }

    current_process() {
        return this.processes[this.current_process_index]
    }

    step() {
        if (!this.active) {
            throw 'MatchAlreadyDoneException'
        }

        // run the currently selected thread
        this.cycle++

        this.step_instruction(this.current_process().pop())

        // prepare next cycle process

        this.set_current_process_index((1 + this.current_process_index) % kNUM_PROGRAMS)

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
            const active = this.current_process().num_threads()

            if (active) {
                console.log(`Status: Process #${id} lost a thread and is down to ${active}`)
            } else {
                console.log(`Status: Process #${id} faulted on '${instruction}' at ${address}`)

                // TODO handle all but one dead
                var active_count = 0
                var active_index

                for (var p = 0; p < this.processes.length; p++) {
                    if (this.processes[p].num_threads() > 0) {
                        active_count++
                        active_index = p
                    } 
                }

                if (active_count == 1) {
                    // we have a winner
                    console.log(`End of Game: Process #${active_index} wins after ${this.cycle} cycles`)
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