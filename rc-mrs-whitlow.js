class MrsWhitlow {
    
    constructor(environment) {
        this.zeus = new Zeus(environment)
        this.tournament_state = {}
    }

    set_environment(environment) {
        this.zeus.set_environment(environment)
    }

    run_tournament(score_callback) {
        this.score_callback = score_callback
        this.zeus.on_log = undefined

        var self = this

        this.zeus.on_score = function (id, score, name) {
            self.warriors[id].score += score
            self.warriors[id].name = name
        }

        // run each pair against each other
        
        this.tournament_state.start = performance.now()
        this.tournament_state.cycles = 0

        this.run_tournament_match(0, 0, true)
    }    

    run_match(score_callback) {
        this.score_callback = score_callback
        this.zeus.on_log = undefined

        var self = this

        this.zeus.on_score = function (id, score, name) {
            self.warriors[id].score += score
            self.warriors[id].name = name
        }

        this.tournament_state.start = performance.now()
        this.tournament_state.cycles = 0

        this.run_tournament_match(0, 1, false)
    }

    set_warriors(warriors) {
        this.warriors = []
        
        for (var i = 0; i < warriors.length; i++) {
            var code = warriors[i] + `\n;zeus_id ${i}`

            this.warriors.push({
                code: code,
                id: i,
                score: 0
            })
        }
    }

    run_tournament_match(w1, w2, tournament) {
        if (w1 != w2) {
            // run match

            this.zeus.reset()
            this.zeus.load_code(this.warriors[w1].code)
            this.zeus.load_code(this.warriors[w2].code)
            this.zeus.validate_programs()

            this.tournament_state.cycles += this.zeus.run()

            const results = []

            for (var p = 0; p < this.warriors.length; p++) {
                results.push({
                    name: this.warriors[p].name,
                    score: this.warriors[p].score
                })
            }

            const num_w = this.warriors.length
            const total = num_w ** 2 - num_w
            const ran = w1 * num_w + w2 - w1 + 1

            const duration = ~~(performance.now() - this.tournament_state.start)
            const mips = ~~((this.tournament_state.cycles / 10) / duration) / 100

            const info = {
                duration: duration,
                mips: mips,
                cycles: this.tournament_state.cycles,
                ran: ran,
                total: total
            }

            if (this.score_callback) {
                this.score_callback(results, info)
            }
        }

        if (tournament) {
            // keep going

            var next_w1 = w1
            var next_w2 = w2 + 1
            
            if (next_w2 == this.warriors.length) {
                next_w2 = 0
                next_w1++

                if (next_w1 == this.warriors.length) {
                    // done
                    return
                }
            } 

            var self = this

            setTimeout( function () {
                self.run_tournament_match(next_w1, next_w2, true)
            }, 0)
        }
    }
}