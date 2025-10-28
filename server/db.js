//db.js
const pg = require('pg')
const { Pool } = pg

const {
  DATABASE_URL,
  DB_HOST = 'localhost',
  DB_PORT='5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'secret',
  DB_NAME = 'notesdb',
  NODE_ENV,
} = process.env;

const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: false,
})
: new Pool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: false,
})

module.exports = pool;