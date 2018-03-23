class Core {

    constructor() {
        this.alu = new ALU()
        
        this.current_process_index = 0
        this.cycle = 0
        this.active = true

        this.init_memory()

        this.processes = new Array()

        for (var i = 0; i < kNUM_PROGRAMS; i++) {
            this.processes.push(new Process())
        }
    }

    init_memory() {
        this.memory = new Array(kCORE_MEMORY_SIZE)

        for (var a = 0; a < kCORE_MEMORY_SIZE; a++) {
            this.memory[a] = new Instruction(DAT, null, null)
        }
    }

    load_program(program, process_id, address) {
        for (var a = 0; a < program.instructions.length; a++) {
            this.memory[a + address] = program.instructions[a]
            this.memory[a + address].process_id = process_id
        }

        this.processes[process_id].pop_all()
        this.processes[process_id].push(address)
    }

    current_process() {
        return this.processes[this.current_process_index]
    }

    step() {
        // run the currently selected thread
        this.cycle++

        const ip = this.current_process().pop()

        this.step_instruction(ip)

        // prepare next cycle process

        this.current_process_index = (1 + this.current_process_index) % kNUM_PROGRAMS

        return this.active
    }

    step_instruction(address) {
        // own the instruction
        this.memory[address].process_id = this.current_process_index
        
        // grab a copy of the instruction to cache it and prevent changes during
        // execution
        const instruction = this.memory[address].copy()
        
        // special handling for the for opcode that breaks protocol by spawning
        // another thrad
        if (instruction.forks) {
            this.current_process().push(wrap(address + 1))
        }

        var next_address = instruction.execute(address, this)

        if (next_address != null) {
            next_address = wrap(address + next_address)

            this.current_process().push(next_address)
        }
        else {
            const id = this.current_process_index
            const active = this.current_process().num_threads()

            if (active) {
                console.log(`Status: Process #${id} lost a thread and is down to ${active}`)
            } else {
                console.log(`Status: Process #${id} faulted`)

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
        return this.memory[this.current_process().next()]
    }

    dump() {
        return this.memory_dump(0, kCORE_MEMORY_SIZE, this.memory)
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
            var i = this.memory[a]
            var out = padln(a, 4) + '   ' + i.to_string()
            output.push(out)
        }

        return output
    }

}