class Zeus {

    constructor(environment) {
        this.environment = environment
        this.core = new Core(environment)
        this.reset()
    }

    reset() {
        this.programs = []
        this.environment = new Environment()
    }

    set_environment(environment) {
        this.environment = environment

        // updating is too hard. let's just make a new one
        this.core = new Core(environment)
    }

    load_code(code) {
        const p = new Program(code, this.environment)
        
        if (p.errors.length) {
            this.report(`Warrior failed to assemble`)
            return
        }

        p.zeus_identifier = this.programs.length
        p.zeus_score = 0
    
        if (!p.metadata.has('ZEUS_ID')) {
            this.report(`Warrior ${p.metadata.get('NAME')} is missing metadata entry 'ZEUS_ID'`)
        }

        this.programs.push(p)
        
        const id = this.programs.length
        const name = p.metadata.get('NAME')
        this.report(`Successfully assembled warrior #${id} "${name}"`)
    }

    validate_programs() {
        // validate max. program length

        for (var i = this.programs.length - 1; i >= 0; i--) {
            const p = this.programs[i]
            
            if (p.instructions.length > this.environment.max_instructions) {
                report(`Warrior #${1+i} "${p.metadata.get('NAME')}" is disqualified for excessive code length (${p.instructions.length}).`)
                this.programs.splice(i, 1)
            }
        }

        // report initial empty score set 
        this.report_score()
    }

    report(message) {
        if (this.on_log) {
            this.on_log(message)
        }
    }

    report_score() {
        if (this.on_score) {

            for (var i = 0; i < this.programs.length; i++) {
                const p = this.programs[i]
                this.on_score(p.metadata.get('ZEUS_ID'), p.zeus_score, p.metadata.get('NAME'))
            }
        }
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
            const code = this.programs[i].code
            this.programs[i] = new Program(code, this.environment)
            this.programs[i].zeus_score = 0
        }
        
        for (var round = 0; round < this.environment.num_rounds; round++) {
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
            var name = program.metadata.get('NAME')

            if (name === undefined) {
                name = `Unnamed-${p}`
            }

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

        this.report_score()
        
        return cycles
    }

    run_round(round) {
        this.core.reset()

        for (var p in this.programs) {
            this.core.load_program(this.programs[p])
        }

        for (var cycle = 0; cycle < this.environment.max_cycles; cycle++) {
            if  (!this.core.step()) {
                break;
            }
        }

        const survivors = this.core.processes.map(p => p = {
            name: `"${p.program.metadata.get('NAME')}"`,
            identifier: p.zeus_identifier,
        })

        if (survivors.length > 1) {
            const names = survivors.map(p => p = p.name).join(', ')
            this.report(`Round #${round+1} TIED after ${this.core.cycle} cycles between ${names}`)
        } else if (survivors.length == 1) {
            this.report(`Round #${round+1} WON after ${this.core.cycle} cycles by ${survivors[0].name}`)
        } else {
            throw 'NoSurvivingProcessError'
        }
        
        // calculate score by formula (w * w - 1) / s
        const score = ~~((this.programs.length ** 2 - 1) / survivors.length)

        for (var i = 0; i < this.core.processes.length; i++) {
            this.core.processes[i].program.zeus_score += score
        }

        return this.core.cycle
    }
}