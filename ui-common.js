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
        return string + this;
    } else {
        return this.substring(0, index) + string + this.substring(index, this.length);
    }
}

function number_text(text) {
    text = text.replace(/;/g, 'ÿ').html()
    const lines = text.split('\n')

    const pad_len = ('' + lines.length).length
    var s = ''

    for (var i = 0; i < lines.length; i++) {
        n = (1 + i + '').padStart(pad_len)

        var line = lines[i]

        if (line.includes('ÿ')) {
            const idx = line.indexOf('ÿ')
            line = line.insert(idx, '<span class="comment">') + '</span>'
            line = line.replace(/ÿ/g, ';')
        }

        if (i % 10 == 9) {
            s += `<u>${n}</u> ${line}<br>`
        } else {
            s += `<span class='num'>${n}</span> ${line}<br>`
        }
    }

    return s
}
