require('dotenv').config()
const checker = require('./src/checker')
const bot = require('./src/bot')

checker.on('new_section', (section, _module, statics) => {
    let text = `<b>New section:</b> ${section}\n\nModule: https://vk.com/${_module}`

    const _statics = {
        js: [],
        css: [],
    }

    statics.split(',').forEach(filename => /js$/.test(filename) ? _statics.js.push(filename) : _statics.css.push(filename))

    if (_statics.js.length) {
        text += '\n\nJS files:'

        _statics.js.forEach(filename => text += `\nhttp://vk.com/js/al/${filename}`)
    }

    if (_statics.js.length) {
        text += '\n\nCSS files:'

        _statics.js.forEach(filename => text += `\nhttp://vk.com/css/al/${filename}`)
    }

    bot.post(text)
})