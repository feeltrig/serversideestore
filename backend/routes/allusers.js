const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "feeltrig",
  password: "123",
  database: "estoredb",
});

router.get("/users", (req, res) => {
  const sql = "SELECT * FROM estoreusers";

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;
