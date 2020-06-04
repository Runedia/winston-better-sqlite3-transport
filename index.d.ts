import Transport from 'winston-transport';
import BetterSqlite3 from 'better-sqlite3';
export default class SQLite3 extends Transport {
    db: BetterSqlite3.Database;
    params: string[];
    insertStmt: string;
    columnsTyped: string[];
    table: string;
    insert: BetterSqlite3.Statement<any[]>;
    constructor(options: any);
    log(info: any, callback: Function): void;
}
