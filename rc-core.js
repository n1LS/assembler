class ALU {
    constructor() {}
    
    static normalize(address) {
        const val = address % kCORE_MEMORY_SIZE
        return val
    }

    static sanitize(address) {
        const val = (address + kCORE_MEMORY_SIZE_UPPER) % kCORE_MEMORY_SIZE
        return val
    }
}

class RAM {
    constructor() {
        this.current_process_index = -1
        
        this.memory = new Array(kCORE_MEMORY_SIZE)
        this.clear()
    }
    
    clear() {
        for (var a = 0; a < kCORE_MEMORY_SIZE; a++) {
            this.memory[a] = new Instruction(DAT, null, null)
        }
    }
    
    r(address) {
        address = ALU.sanitize(address)
       
        this.memory[address].read_flag = this.current_process_index
        return this.memory[address]
    }
    
    w(address, instruction) {
        address = ALU.sanitize(address)
        
        this.memory[address] = instruction
        this.memory[address].write_flag = this.current_process_index
    }
    
    random_address(size) {
        while (1) {
            const address = ~~(Math.random() * this.memory.length)
            var fits = true
            
            for (var o = 0; o < size; o++) {
                const a = ALU.sanitize(o + address)

                if (this.memory[a].write_flag !== -1) {
                    fits = false
                    break
                }
            }
            
            if (fits) {
                return address
            }
        }
    }
}

class Core {

    constructor() {
        this.cu = new ControlUnit()
        this.ram = new RAM()
        
        this.reset()
    }
    
    set_current_process_index(i) {
        this.current_process_index = i
        this.ram.current_process_index = i
    }
    
    reset() {
        this.cycle = 0
        this.active = true
        this.processes = []

        this.ram.clear()

        this.set_current_process_index(0)
    }
    
    load_program(program, address) {
        if (address === undefined) {
            address = this.ram.random_address(program.instructions.length)
        }

        if (this.processes.length == 0) {
            // first program always loads @ 0
            address = 0
        }
        
        const pid = this.processes.length
        this.ram.current_process_index = pid
        
        for (var a = 0; a < program.instructions.length; a++) {
            this.ram.w(a + address, program.instructions[a])
        }
        
        this.processes[pid] = new Process(program)
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
            const addr = this.current_process().pop()
            
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
            this.current_process().push(address + 1)
        }

        if (this.ram.memory[address] === undefined) {
            console.log('address: ' + address)
            console.log('mem size' + this.ram.memory.length)
        }

        // INSTRUCTION EXECUTION returns the next program counter
        this.ram.memory[address].execution_flag = this.current_process_index

        var next_pc = instruction.execute(address, this.ram)
        
        if (next_pc != null) {
            this.current_process().push(address + next_pc)
        } else {
            // instruction could not be executed and returned null
            
            const id = this.current_process_index
            const ts = this.current_process().num_threads()
            
            if (ts == 0) {
                // remove process
                this.processes.splice(id, 1)
                
                if (id >= this.processes.length) {
                    this.set_current_process_index(0)
                }
                
                if (this.processes.length == 1) {
                    // we have a winner, print name: TODO
                    // console.log(`End of Game: Process #${0} wins after ${this.cycle} cycles`)
                    this.active = false
                }
            }
        }
    }
    
    /* UI IO stuff that kinda needs to be moved out of here *******************/
    
    next_instruction() {
        const p = this.current_process()

        if (p === undefined) {
            return null
        }

        const n = p.next()
        
        if (n === undefined) {
            return null
        }
        
        return this.ram.memory[n]
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
            var addr = ALU.sanitize(a)
            var i = this.ram.memory[addr]

            var out = padln(addr, kMAX_ADDRESS_WIDTH - 1) + ' ' + i.to_string()
            output.push(out)
        }
        
        return output
    }
}
