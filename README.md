# winston-better-sqlite3-transport

aka wbst

`sqite3` Transport for [Winson](https://github.com/winstonjs/winston)

## Install

```bash
$ npm install winston-better-sqlite3-transport
```

## Use

```js
const winston = require('winston')

const wbst = require('winston-better-sqlite3-transport')
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { resource: 'renew' },
    transports: [
        new wbst({
            // 'db' is required, and should include the full
            // path to the sqlite3 database file on the disk
            db: '<name of sqlite3 database file>',

            // A list of the log params to log. Defaults to
            // ['level, 'message']. These params are used as
            // columns in the sqlite3 table
            params: ['level', 'resource', 'query', 'message'],
        }),
    ],
})
```

if usage in vue-cli-plugin-electron-builder

```js
electronBuilder: {
    externals: ['winston-better-sqlite3-transport'],
}
```

There are a couple of `sqlite3` transports for Winston out there, but this one is different. For one, it uses Josuha Wise's most excellent [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) package. Second, in my biased opinion, `wbst` is also better because it uses no ORMs or any such middleware. It is just a plain, no-nonsense transport that writes the logs to a `sqlite3` database. You have to provide the name of (and path to) the database file, but the module creates a table called `log` (if it doesn't already exist) with the following four columns by default

```sql
CREATE TABLE IF NOT EXISTS log (
    id INTEGER PRIMARY KEY,
    timestamp INTEGER DEFAULT (strftime('%s','now')),
    level TEXT,
    message TEXT
);
```

Later on, in your program where you want to log something

```js
logger.log({
    level: 'info',
    resource: 'collaborators',
    query: 'q=punkish',
    message: 'searching for folks',
})
```

**Note:** The user has to provide only the name of the `sqlite3` database file. The module will create a database if it doesn't already exist (as `sqlite3` always does), and will create a table called `log` inside the database if the table doesn't already exist.

The `id` and `timestamp` columns are automatically inserted by `sqlite3`. The user can provide whatever others columns needed for tracking logging info. For example, I use `level`, `resource`, `query` and `message` in one of my projects (as shown in the example above). All logging params are stored in columns of datatype `TEXT`.

forked from (punkish/winston-better-sqlite3)[https://github.com/punkish/winston-better-sqlite3]  
I just modify (this)[https://github.com/punkish/winston-better-sqlite3/issues/1] issue.
