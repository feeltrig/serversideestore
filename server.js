const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mysql = require("mysql");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// PORTS
const PORT = process.env.PORT || 3001;

// SERVER
app.get("/", (req, res) => {
  console.log(`Server started at PORT`);
});

// STATIC FOLDER
app.use(express.static(path.join(__dirname, "staticfolder")));

// ROUTES
app.get("/api/stuff", (req, res) => {
  console.log(`Server started at PORT`);
  res.json(data);
});

// MYSQL DB
const db = mysql.createConnection({
  host: "localhost",
  user: "feeltrig",
  password: "123",
  database: "estoredb",
});

db.connect();

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM estoreusers";

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post("/api/submitform", (req, res) => {
  // for urlecoded
  // console.log(req.body.password);

  // console.log(req.body);
  // console.log(req.headers["content-type"]);
  // res.send("api worked fine");
  const { username, password, city } = req.body;
  console.log(username, password, city);

  db.query(
    "INSERT INTO estoreusers(username,password,city) VALUES (?,?,?)",
    [username, password, city],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send(result);
    }
  );
});

// USER AUTH

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // res.send();

  // check for user existence
  db.query(
    "SELECT username, password FROM estoreusers WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) throw err;
      // res.send(result);

      // need to convert to string and parse back to json
      // to access values from db rowpacketobject
      let final = JSON.parse(JSON.stringify(result));
      console.log(final);
      if (final.length > 0) {
        res.send(final);
      }
    }
  );
});

app.listen(PORT);

console.log("server running on " + PORT);

let somthing = {};

console.log(somthing.username);
