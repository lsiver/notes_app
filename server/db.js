//db.js
const pg = require('pg')
const { Pool } = pg

const pool = new Pool({
  host: 'localhost', port: 5432, user: 'postgres', password: 'secret', database: 'notesdb',
});

module.exports = pool;