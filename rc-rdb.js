// setup ***********************************************************************

const rdb_commands = [
    {keyword: 'peek', shorthand: '', action: cmd_peek = 0},
    {keyword: 'poke', shorthand: '', action: cmd_poke = 1},
    {keyword: 'run',  shorthand: '', action: cmd_run = 2},
    {keyword: 'step', shorthand: '', action: cmd_Step = 4},
    {keyword: 'help', shorthand: '', action: cmd_help = 5},
]


function create_min_keywords() {
    rdb_commands.forEach(command => {
        // find shortest unique equivalent for each keyword
        const key = command.keyword

        for (var c = 1; c < key.length; c++) {
            var unique = key.substr(0, c)
            
            rdb_commands.some(other => {            
                if (other.keyword !== key && other.keyword.startsWith(unique)) {
                    unique = undefined
                    return
                }
            })

            if (unique) {
                command.shorthand = unique
                break
            }
        }
    })
}

// implementation **************************************************************

class CommandHistory {

    constructor() {
        this.history = []
        this.index = 0
    }

    push_command(command) {
        var i = this.history.indexOf(command)
        
        if (i != -1) {
            this.history.splice(i, 1)
        }

        this.history.push(command)
        this.index = this.history.length
    }

    get_previous() {
        if (this.index > 0) {
            this.index--
        }

        return this.get_current()
    }

    get_current() {
        if (this.history.length) {
            const idx = Math.min(this.index, this.history.length - 1)
            return this.history[this.index]
        }

        return ''
    }

    get_next() {
        if (this.index < this.history.length - 1) {
            this.index++
        }

        return this.get_current()
    }
}

class Debugger {

    constructor() {
        create_min_keywords()
        this.core = undefined
        this.output_handler = console.log

        this.history = new CommandHistory()
    }

    output(text) {
        if (this.output_handler) {
            this.output_handler(text)
        }
    }

    attach_to(core) {
        this.core = core
    }

    command(instruction) {
        if (this.core === undefined) {
            this.error_not_attached_to_core()
            return
        }

        this.history.push_command(instruction)

        instruction = instruction.trim()

        var list = instruction.split(' ')
        var keyword = list.shift().toLowerCase()
        var success = false

        rdb_commands.forEach(command => {
            if (keyword.startsWith(command.shorthand)) {
                success = true

                switch (command.action) {
                    case cmd_help: 
                        this.command_help(list)
                        break
                    case cmd_peek:
                        this.command_peek(list)
                        break
                    case cmd_poke:
                        this.command_poke(list)
                        break
                    case cmd_step:
                        this.command_step(list)
                        break
                    case cmd_run:
                        this.command_run(list)
                        break
                    default: 
                        success = false
                }
            }
        })

        if (!success) {
            this.error_command_not_found(instruction)
        }
    }

    /* error implementations **************************************************/

    error_not_attached_to_core(command) {                                       this.output(`E102: Debugger is not attached to a core`) }
    error_command_not_found(command) {                                          this.output(`E101: Command not found. Run 'help' for a list of all available commands`) }
    error_missing_parameters(command) {                                         this.output(`E100: Missing parameters`) }

    /* command implementations ************************************************/

    command_step(command) {
        const pid = this.core.current_process_index
        const process = this.core.processes[this.core.current_process_index].instruction_pointers
        const addr = process[process.length - 1]

        this.output(`Stepping processes ${pid}:`)

        const instr = this.core.ram.memory[addr]
        
        const size = this.core.environment.core_size
        const l = (size + '').length
        const a_name = (addr + '').padStart(l, '0')
        
        this.output(`${a_name}: ${instr.to_string()}`)
        
        this.core.step()
    }

    command_run(command) {
    }

    command_help(command) {
        this.output(`Command listing:`)

        rdb_commands.forEach(command => {
            this.output(`\t${command.keyword} (${command.shorthand})`)
        })
    }

    command_peek(command) {
        if (command.length == 0) {
            this.error_missing_parameters(command)
            return
        }

        const size = this.core.environment.core_size
        const start = (size + parseInt(command[0])) % size
        var end = start
        
        if (command.length > 1) {
            end = (size + parseInt(command[1])) % size
        }

        if (end < start) {
            end += size
        }

        const l = (size + '').length

        for (var addr = start; addr < end + 1; addr++) {
            const a = addr % size
            const a_name = (a + '').padStart(l, '0')
            const instr = this.core.ram.memory[a]
            this.output(`${a_name}: ${instr.to_string()}`)
        }
    }

    command_poke(command) {
    }

}

