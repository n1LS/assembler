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
    }

}

class Value {

    constructor(value, mode) {
        this.value = value
        this.mode = mode
    }

}

class Process {

    constructor() {
        this.max_process_count = kMAX_PROCESS_COUNT
        this.current_thread = 0
        this.instruction_pointers = []
    }

    num_threads() {
        return this.instruction_pointers.length
    }

    current_instruction_pointer() {
        return this.instruction_pointers[this.current_thread]
    }

    add_thread(address) {
        this.instruction_pointers.push(address)
    }

    clear() {
        this.instruction_pointers = []
        this.current_thread = 0
    }

    write(address) {
        this.instruction_pointers[this.current_thread] = address
    }

    step() {
        this.current_thread = (this.current_thread + 1) % this.instruction_pointers.length
    }

    kill_current_thread() {
        this.instruction_pointers.splice(this.current_thread, 1);
    }

}