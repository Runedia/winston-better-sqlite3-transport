'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const winston_transport_1 = tslib_1.__importDefault(require('winston-transport'))
const better_sqlite3_1 = tslib_1.__importDefault(require('better-sqlite3'))
class SQLite3 extends winston_transport_1.default {
    constructor(options) {
        super(options)
        if (!options.hasOwnProperty('db')) {
            throw new Error('"db" is required')
        } else {
            this.db = new better_sqlite3_1.default(options.db)
        }
        this.params = options.params || ['level', 'message']
        this.insertStmt = `INSERT INTO log (${this.params.join(', ')}) VALUES (${this.params.map((e) => '?').join(', ')})`
        this.columnsTyped = this.params.map((p) => {
            return p + ' TEXT'
        })
        this.columnsTyped.unshift('id INTEGER PRIMARY KEY', "timestamp INTEGER DEFAULT (strftime('%s','now'))")
        this.table = `CREATE TABLE IF NOT EXISTS log (${this.columnsTyped.join(', ')})`
        this.db.prepare(this.table).run()
        this.insert = this.db.prepare(this.insertStmt)
    }
    log(info, callback) {
        let params = []
        this.params.forEach((el) => {
            params.push(info[el])
        })
        setImmediate(() => {
            this.emit('logged', info)
        })
        this.insert.run(params)
        callback()
    }
}
exports.default = SQLite3
