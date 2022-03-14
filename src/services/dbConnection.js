const Pool = require('pg').Pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized:false,
  }
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