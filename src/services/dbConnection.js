const Pool = require('pg').Pool

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

async function query(sql, params) {
  try {
    console.log("sql --->",sql)
    const {rows} = await pool.query(sql, params);
    return rows;
  } catch (e) {
    console.log(e)
    throw new Error(e);
  }
}

module.exports = {
  query,
}