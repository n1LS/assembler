String.prototype.html = function () {
    const escape = [
        ['>', '&gt;'],
        ['<', '&lt;'],
    ]

    var html = this

    escape.forEach(item => {
        while (html.includes(item[0])) {
            html = html.replace(item[0], item[1])
        }
    })

    return html
}

String.prototype.insert = function(index, string) {
    if (index == 0) {
        return string + this
    } else {
        return this.substring(0, index) + string + this.substring(index, this.length)
    }
}

function number_text(text, syntax_coloring, number_empty) {
    text = text.replace(/;/g, '\x1e').html()
    const lines = text.split('\n')

    const pad_len = ('' + lines.length).length
    var s = ''

    var op_regex = new RegExp(`\\b(${__op_regex})\\b`, 'gi')
    var pop_regex = new RegExp(`\\b(${__pop_regex})\\b`, 'gi')

    var line_number = 0

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var line_display = '|'

        if (number_empty !== false) {
            line_display = i + 1
        } else {
            if (line.length != 0) {
                line_display = line_number + 1
                line_number++
            }
        }

        n = (line_display + '').padStart(pad_len)

        if (syntax_coloring) {
            line = line.replace(/-?\b\d+/g, '<span class="number">$&</span>')

            line = line.replace(op_regex, '<span class="opcode">$&</span>')
            line = line.replace(pop_regex, '<span class="keyword">$&</span>')
            
            line = line.replace(/\B(@|#|\$|\*|&gt;|&lt;|{|})/g, '<span class="address_mode">$&</span>')
        }

        if (line.includes('\x1e')) {
            const idx = line.indexOf('\x1e')
            
            if (syntax_coloring) {
                const pre = line.substring(0, idx)
                const post = line.substring(idx).replace(/<(?:.|\n)*?>/gm, '')
                line = `${pre}<span class='comment'>${post}</span>`
            }
            
            line = line.replace(/\x1e/g, ';')
        }

        if (i % 10 == 9) {
            s += `<u>${n}</u> ${line}<br>`
        } else {
            s += `<span class='num'>${n}</span> ${line}<br>`
        }
    }

    return s
}

function number_assembly(text, syntax_coloring) {
    const lines = text.split('\n')

    const pad_len = ('' + lines.length).length
    var s = ''

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        n = (1 + i + '').padStart(pad_len)

        if (syntax_coloring) {
            num_length = ~~(line.length - 3) / 2

            op = line.substring(0, 1)
            ma = line.substring(1, 2)
            va = line.substring(2, 2 + num_length)
            mb = line.substring(2 + num_length, 3 + num_length)
            vb = line.substring(3 + num_length, 3 + 2 * num_length)

            line = `<span class='opcode'>${op}</span>` + 
                   `<span class='address_mode'>${ma}</span><span class='number'>${va}</span>` +
                   `<span class='address_mode'>${mb}</span><span class='number'>${vb}</span>`
        }

        if (i % 10 == 9) {
            s += `<u>${n}</u> ${line}<br>`
        } else {
            s += `<span class='num'>${n}</span> ${line}<br>`
        }
    }

    return s
}
