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

    load_program(program, user_id, address) {
        for (var a = 0; a < program.instructions.length; a++) {
            this.memory[a + address] = program.instructions[a]
            this.memory[a + address].process = user_id
        }

        this.processes[user_id].clear()
        this.processes[user_id].add_thread(address)
    }

    current_process() {
        return this.processes[this.current_process_index]
    }

    step() {
        // run the currently selected thread
        this.cycle++

        var cp = this.current_process() 
        var ip = cp.current_instruction_pointer()

        this.step_instruction(ip)

        // prepare next cycle

        this.current_process_index = (this.current_process_index + 1) % kNUM_PROGRAMS

        return this.active
    }

    step_instruction(address) {
        var instruction = this.memory[address]
        var next_address = null

        switch (instruction.opcode) {
            case MOV: next_address = this.MOV(instruction, address); break
            case ADD: next_address = this.ADD(instruction, address); break
            case JMP: next_address = this.JMP(instruction, address); break
        }

        
        if (next_address != null) {
            next_address = (address + next_address) % kCORE_MEMORY_SIZE

            this.current_process().write(next_address)
            this.current_process().step()
        }
        else {
            this.current_process().kill_current_thread()
            
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

    JMP(instruction, address) {
        const destination = this.alu.resolve_address(instruction.a, address, this.memory)
        return (destination - address)
    }
    
    ADD(instruction, address) {
        switch (instruction.a.mode) {
            case addr_immediate:
                switch (instruction.b.mode) {
                    case addr_immediate:
                        instruction.b.value += instruction.a.value
                        break
                    case addr_direct:
                    case addr_indirect:
                        var dst = this.alu.resolve_address(instruction.b, address, this.memory)
                        this.memory[dst].b.value += instruction.a.value
                        break
                }
                break
            
            case addr_direct:
            case addr_indirect:
                console.log(`Unhandled case in ${instruction} at address ${address}`)
        }
        
        return 1
    }
    
    MOV(instruction, address) {
        var abs_source = this.alu.resolve_address(instruction.a, address, this.memory)
        var abs_destination = this.alu.resolve_address(instruction.b, address, this.memory)
        
        // copy in memory
        this.memory[abs_destination] = this.memory[abs_source].clone()
        return 1
    }

    /* UI IO stuff that kinda needs to be moved out of here *******************/

    next_instruction() {
        return this.memory[this.current_process().current_instruction_pointer()]
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