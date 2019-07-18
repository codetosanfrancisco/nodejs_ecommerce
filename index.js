const pg = require("pg");

const Pool = new pg.Pool({
  user: "macbookair",
  host: "localhost",
  port: "5432",
  database: "ecomm",
  password: "macbookair"
});

module.exports = Pool;
