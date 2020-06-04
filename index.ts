import Transport from 'winston-transport'
import BetterSqlite3 from 'better-sqlite3'

export default class SQLite3 extends Transport {
    db: BetterSqlite3.Database
    params: string[]
    insertStmt: string
    columnsTyped: string[]
    table: string
    insert: BetterSqlite3.Statement<any[]>

    constructor(options: any) {
        super(options)

        if (!options.hasOwnProperty('db')) {
            throw new Error('"db" is required')
        } else {
            this.db = new BetterSqlite3(options.db)
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

    log(info: any, callback: Function) {
        let params: string[] = []
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
