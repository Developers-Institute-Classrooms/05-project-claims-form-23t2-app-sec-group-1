const Pool = require("pg").Pool;
const pool = new Pool(process.env.DATABASE_URL);

module.exports = pool;
