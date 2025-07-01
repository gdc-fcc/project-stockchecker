var crypto = require('crypto');
const hash = data => crypto.createHash('md5').update(data).digest("hex")

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('likes.db', e => { });

db.run(`
    CREATE TABLE IF NOT EXISTS likes (
        stock TEXT,
        ip_hash TEXT,
        PRIMARY KEY (stock, ip_hash)
    )`
);

const insert = (stock, ip) => {
    return new Promise((resolve, _reject) => {
        db.run("INSERT INTO likes(stock, ip_hash) VALUES(?,?)", [stock, hash(ip)], (err) => {
           err ? resolve(0) : resolve(1);
        })
    })
}

const get = stock => {
    return new Promise((resolve, _reject) => {
        db.get("SELECT COUNT(*) AS count FROM likes WHERE stock = ?", stock, (_err, row) => {
            resolve(row.count)
        })
    })
}

module.exports = {insert, get}

const shutDown = () => {
    try { db.close(() => {
        process.exit(0)
    }) } catch(e) {
        process.exit(1);
    };

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
