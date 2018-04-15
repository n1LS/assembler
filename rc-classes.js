class Program {

    constructor(code) {
        var preprocessor = new Preprocessor()
        var output = preprocessor.preprocess(code)

        this.metadata = output.metadata
        this.errors = output.errors
        this.warnings = output.warnings
        
        if (this.errors.count) {
            return
        }
        
        var assembler = new Assembler()
        var assembly = assembler.assemble(output.code)
        
        this.errors.concat(assembly.errors)
        this.warnings.concat(assembly.warnings)
        
        if (assembly.errors.count) {
            return
        }
        
        this.instructions = assembly.code
        this.load_address = assembly.load_address
    }

    hash() {
        var value_sum = 0

        for (var i = 0; i < this.instructions.length; i++)  {
            const ins = this.instructions[i]
            value_sum += ins.a.value + ins.b.value
        }
        
        return `${this.instructions.length}-${this.metadata.size}-${this.load_address}-${value_sum}`
    }

}

class Value {

    constructor(value, mode) {
        this.value = value
        this.mode = mode
        this.pointer = 0
    }

    copy() {
        return new Value(this.value, this.mode)
    }

    is_equal(other) {
        return (this.value == other.value) && (this.mode == other.mode)
    }

}

class Process {

    constructor(program) {
        this.program = program
        this.instruction_pointers = []
    }

    num_threads() {
        return this.instruction_pointers.length
    }

    pop_all() {
        this.instruction_pointers = []
    }
    
    push(address) {
        if (this.instruction_pointers.length < kMAX_PROCESS_COUNT) {
            this.instruction_pointers.push(ALU.sanitize(address))
        }
    }

    pop() {
        return this.instruction_pointers.shift()
    }

    next() {
        return this.instruction_pointers[0]
    }

}