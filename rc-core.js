class Core {

    constructor() {
        this.memory_size = kCORE_MEMORY_SIZE
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
        this.memory = new Array(this.memory_size)

        for (var a = 0; a < this.memory_size; a++) {
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
        var next_address = (address + 1) % this.memory_size

        switch (instruction.opcode) {
            case MOV: 
                this.MOV(instruction, address)
                break
            case ADD: 
                this.ADD(instruction, address)
                break
            case DAT: 
            this.DAT(instruction, address)
                next_address = -1
                break
            case JMP: 
                next_address = this.JMP(instruction, address);
                break
            default: 
                console.log('UNKNOWN OPCODE: ', instruction.opcode)
                next_address = -1
        }

        if (next_address >= 0) {
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

    next_instruction() {
        return this.memory[this.current_process().current_instruction_pointer()]
    }

    dump() {
        return this.memory_dump(0, this.memory_size)
    }

    print_memory(start, end) {
        console.log(this.memory_dump(start, end).join("\n"))
    }

    resolve_address(value, address) {
        var addr

        switch (value.mode) {
            case addr_predecrement:
                var p = (address + value.value) % this.memory_size
                this.memory[p].b.value--
                addr = address + value.value + this.memory[p].b.value
                break
            case addr_direct:
                addr = address + value.value
                break
            case addr_immediate:
                console.log("ERR: Cannot resolve absolute address!")
                addr = value.value
                break
            case addr_indirect:
                var p = (address + value.value) % this.memory_size
                addr = address + value.value + this.memory[p].b.value
                break
            default:
                console.log("ERR: unhandled address mode at address", address)
        }

        return addr % this.memory_size
    }

    JMP(instruction, address) {
        return this.resolve_address(instruction.a, address)
    }

    ADD(instruction, address) {
        switch (instruction.a.mode) {
            case addr_immediate:
                switch (instruction.b.mode) {
                    case addr_immediate:
                        instruction.b.value += instruction.a.value
                        return
                    case addr_direct:
                    case addr_indirect:
                        var dst = this.resolve_address(instruction.b, address)
                        this.memory[dst].b.value += instruction.a.value
                        return
                }
                break

            case addr_direct:
                break

            case addr_indirect:
                break
        }

        console.log("Unhandled case in ", instruction, "at address", address)
    }

    MOV(instruction, address) {
        var abs_source = this.resolve_address(instruction.a, address)
        var abs_destination = this.resolve_address(instruction.b, address)

        // copy in memory
        this.memory[abs_destination] = this.memory[abs_source].clone()
    }

    DAT(instruction, address) {

    }
}