const kWhite        = [0xff,0xff,0xff]
const kSilver       = [0xbb,0xbb,0xbb]
const kBlack        = [0x00,0x00,0x00]
const kGrey         = [0x80,0x80,0x80]
const kDarkGrey     = [0x40,0x40,0x40]
const kDarkestGrey  = [0x20,0x20,0x20]
const kProcess1     = [0xf0,0x60,0x20]
const kProcess2     = [0x20,0x80,0xf0]
const kProcessLow1  = [0xa0,0x40,0x20]
const kProcessLow2  = [0x20,0x60,0xb0]
const kProcess1Text = [0xff,0xc0,0x80]
const kProcess2Text = [0x80,0xe0,0xff]


var ctx = null
var offs_x = 0
var offs_y = 0
var image_data = null
var data = null
var width = 0
var height = 0

var buffer
var buffer_image
var buffer_canvas = null

function draw_set_context(canvas, scale) {
    console.log("Setting context")
    ctx = canvas.getContext('2d')
    width = Math.floor(canvas.width / scale)
    height = Math.floor(canvas.height / scale)
    
    buffer_image = ctx.getImageData(0, 0, width, height)

    if (buffer_canvas === null) {
        buffer_canvas = document.createElement('canvas')
    }

//    buffer_image = buffer_canvas.getContext('2d').createImageData(width, height)
    buffer = new Uint8Array(4 * width * height)
}

function draw_pixel(x, y, color) {
    var idx = 4 * ((offs_x + x) + (offs_y + y) * width)

    buffer[idx++] = color[0]
    buffer[idx++] = color[1]
    buffer[idx++] = color[2]
    buffer[idx] = 0xff
}

function draw_flip() {
    // ctx.scale(scale, scale)
    // ctx.drawImage(buffer_canvas, 0, 0, width, height)
    // ctx.scale(1 / scale, 1 / scale)
    buffer_image.data.set(buffer)
    ctx.putImageData(buffer_image, 0, 0)
}

function draw_rect(x, y, w, h, color) {
    for (var dx = x; dx < x + w; dx++) {
        for (var dy = y; dy < y + h; dy++) {
            draw_pixel(dx, dy, color)
        }
    }
}

function draw_triangles(x, y, w, h, color1, color2) {
    for (dx = 0; dx < w; dx++) {
        for (dy = 0; dy < h; dy++) {
            draw_pixel(x + dx, y + dy, dy < dx ? color2 : color1)
        }
    }
}

function draw_translate_to(x, y) {
    offs_x = x
    offs_y = y
}