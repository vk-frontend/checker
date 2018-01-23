const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')

const token = process.env.TOKEN || ''
const telegraf = new Telegraf(token)
const telegram = new Telegram(token)

module.exports = new class Bot {
    post(text) {
        telegram.sendMessage('@vk_frontend', text, {
            parse_mode: 'HTML'
        })
    }
}