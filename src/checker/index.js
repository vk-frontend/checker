const vm = require('vm')
const rp = require('request-promise')
const sqlite3 = require('sqlite3')
const EventEmitter = require('events')
const db = new sqlite3.Database(__dirname + '/../../updates.db')
const interval = 1000 * 60 * (process.env.INTERVAL || 5)
const loaderNav = `http://vk.com/js/loader_nav0_0.js`

module.exports = new class Checker extends EventEmitter {
    constructor() {
        super()

        db.run('PRAGMA journal_mode = WAL;')
        this.check()

        setInterval(() => {
            this.check()
        }, interval)
    }

    async check() {
        const evalCode = await rp(loaderNav)

        const sandbox = {}

        vm.createContext(sandbox)
        vm.runInContext(evalCode, sandbox)

        const sections = [
            [],
            [],
        ]

        db.all('SELECT * FROM sections', [], (err, rows) => {
            if (err) {
                return console.error(err)
            }

            rows.forEach(elem => sections[0].push(elem.section))

            const currentParams = []

            sandbox.navMap.test6 = ['al_test6.php', ['test6.js', 'test6.css']]

            for (const section in sandbox.navMap) {
                sections[1].push(section)
                currentParams.push([section, sandbox.navMap[section][0], sandbox.navMap[section][1].join(',')])
            }

            sections[1].forEach((elem) => {
                if (sections[0].indexOf(elem) == -1) {
                    currentParams.forEach((section) => {
                        section[0] == elem && this.emit('new_section', ...section)
                    })
                }
            })

            // currentParams.forEach(data => db.all('INSERT OR REPLACE INTO sections (`section`, `module`, `statics`) VALUES (?, ?, ?)', data))
        })
    }
}