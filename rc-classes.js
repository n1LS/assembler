class Environment {

    constructor() {
        this.max_instructions   = 100
        this.core_size          = 4000
        this.max_threads        = 128
        this.num_rounds         = 100
        this.max_cycles         = 8000
        this.p_space_size       = 500
    }

}

class Program {

    constructor(code, environment) {
        var preprocessor = new Preprocessor()
        var output = preprocessor.preprocess(code, environment)

        this.metadata = output.metadata
        this.errors = output.errors
        this.warnings = output.warnings
        
        if (this.errors.count) {
            return
        }
        
        var assembler = new Assembler()
        var assembly = assembler.assemble(output.code, environment)
        
        this.errors.concat(assembly.errors)
        this.warnings.concat(assembly.warnings)
        
        if (assembly.errors.count) {
            return
        }

        if (this.metadata.get('NAME') === undefined) {
            // we should always have a name
            this.metadata.set('NAME', '?')
        }
        
        this.instructions = assembly.code
        this.load_address = assembly.load_address
        this.code = code
    }

    hash() {
        var hash = 0
        var char = 0

        for (var i = 0; i < this.code.length; i++) {
            hash = ((hash * 31) + this.code.charCodeAt(i)) | 0
            if (hash < 0) {
                hash = -hash
            }
        }
    
        return `Wx${hash.toString(16).padStart(8, '0')}`
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

    constructor(program, max_processes) {
        this.program = program
        this.instruction_pointers = []
        this.max_processes = max_processes
    }

    num_threads() {
        return this.instruction_pointers.length
    }

    pop_all() {
        this.instruction_pointers = []
    }
    
    push(address) {
        if (this.instruction_pointers.length < this.max_processes) {
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