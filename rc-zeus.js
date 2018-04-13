class Settings {

    constructor () {
        this.max_instructions   = 100
        this.core_size          = 4000
        this.max_threads        = 128
        this.num_rounds         = 100
        this.max_cycles         = 80000
        this.p_space_size       = 500
    }

}

class Zeus {

    constructor() {
        this.core = new Core()
        this.reset()
    }

    reset() {
        this.programs = []
        this.settings = new Settings()
    }

    set_settings(settings) {
        this.settings = settings
    }

    load_code(code) {
        const p = new Program(code)
        
        if (p.errors.length) {
            this.report(`Warrior failed to assemble`)
            return
        }

        p.zeus_identifier = this.programs.length
        p.zeus_score = 0

        this.programs.push(p)
        
        const id = this.programs.length
        const name = p.metadata['name']
        this.report(`Successfully assembled warrior #${id} "${name}"`)
    }

    validate_programs() {
        // validate max. program length

        for (var i = this.programs.length - 1; i >= 0; i--) {
            const p = this.programs[i]
            
            if (p.instructions.length > this.settings.max_instructions) {
                report(`Warrior #${1+i} "${p.metadata['name']}" is disqualified for excessive code length (${p.instructions.length}).`)
                this.programs.splice(i, 1)
            }
        }
    }

    report(message) {
        this.on_log(message)
    }

    shuffle_programs() {
        if (this.programs.length) {
            const first = this.programs.shift()
            this.programs.push(first)
        }
    }

    run() {
        var cycles = 0
        
        for (var i = 0; i < this.programs.length; i++) {
            this.programs[i].zeus_score = 0
        }
        
        for (var round = 0; round < this.settings.num_rounds; round++) {
            cycles += this.run_round(round)
            this.shuffle_programs()
        }
        
        this.report(`\n* RESULTS ***************************\n`)

        const results = []
        var max_score = 0
        var name_l = 0

        for (var p = 0; p < this.programs.length; p++) {
            const program = this.programs[p]
            const score = program.zeus_score
            const name = program.metadata['name']

            max_score = max_score > score ? max_score : score
            name_l = name.length > name_l ? name.length : name_l
            
            results.push({name: name, score: score})
        }

        const score_l = ('' + max_score).length
        const num_l = ('' + results.length).length

        results.sort(function (a, b) { return b.score - a.score })

        for (var r = 0; r < results.length; r++) {
            const result = results[r]
            const name = result.name.padEnd(name_l + 1)
            const score = ('' + result.score).padStart(score_l)
            const num = ('' + (r + 1)).padStart(num_l)
            this.report(`${num}. ${name} ${score}`)
        }

        return cycles
    }

    run_round(round) {
        this.core.reset()

        for (var p in this.programs) {
            this.core.load_program(this.programs[p])
        }

        for (var cycle = 0; cycle < this.settings.max_cycles; cycle++) {
            if  (!this.core.step()) {
                break;
            }
        }

        const survivors = this.core.processes.map(p => p = {
            name: `"${p.program.metadata['name']}"`,
            identifier: p.zeus_identifier,
        })

        if (survivors.length > 1) {
            const names = survivors.map(p => p = p.name).join(', ')
            this.report(`Round #${round+1} TIED after ${this.core.cycle} cycles between ${names}`)
        } else {
            this.report(`Round #${round+1} WON after ${this.core.cycle} cycles by ${survivors[0].name}`)
        }
        
        // calculate score by formula (w * w - 1) / s
        const score = ~~((this.programs.length ** 2 - 1) / survivors.length)

        for (var i = 0; i < this.core.processes.length; i++) {
            this.core.processes[i].program.zeus_score += score
        }

        return this.core.cycle
    }
}