class Program {

    constructor(code) {
        var preprocessor = new Preprocessor()
        var output = preprocessor.preprocess(code)

        this.errors = output.errors;
        this.warnings = output.warnings;
        
        if (this.errors.count) {
            return;
        }
        
        var assembler = new Assembler()
        var assembly = assembler.assemble(output.code)
        
        this.errors.concat(assembly.errors)
        this.warnings.concat(assembly.warnings)
        
        if (assembly.errors.count) {
            return;
        }
        
        this.instructions = assembly.code
        this.load_address = assembly.load_address
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

}

class Process {

    constructor() {
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
            this.instruction_pointers.push(address)
        }
    }

    pop() {
        return this.instruction_pointers.shift()
    }

    next() {
        return this.instruction_pointers[0]
    }

}