const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mysql = require("mysql");
const { DATE } = require("mysql/lib/protocol/constants/types");
const { timeStamp } = require("console");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
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

// GET ALL USER DATA
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM estoreusers";

  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// CREATE USER
app.post("/api/submitform", (req, res) => {
  // for urlecoded
  // console.log(req.body.password);

  // console.log(req.body);
  // console.log(req.headers["content-type"]);
  // res.send("api worked fine");

  // GETTING DATA FROM USER
  const { username, password, city } = req.body;

  // check for existing user otherwise cancel insert
  db.query(
    "SELECT username, password FROM estoreusers WHERE username = ? AND password = ?",
    [username.toString(), password.toString()],
    (err, result) => {
      if (err) throw err;

      // STOP PROPOGATION IF USER EXISTS
      if (result.length > 0) {
        res.json({ message: "user already exist" });
        return;
      }

      // CREATE NEW USER IF DOESNT EXISTS
      console.log("user is new");
      db.query(
        "INSERT INTO estoreusers(username,password,city) VALUES (?,?,?)",
        [username, password, city],
        (err, result) => {
          if (err) throw err;
          res.json(result);
        }
      );
    }
  );
});

// USER AUTH
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // check for user existence
  db.query(
    "SELECT username, password, id FROM estoreusers WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) throw err;

      // need to convert to string and parse back to json
      // to access values from db rowpacketobject
      let final = JSON.parse(JSON.stringify(result));
      if (final.length > 0) {
        final.push({ allowAccess: "true" });
        res.json(final);
      } else {
        res.sendStatus(500);
      }
    }
  );
});

// UPDATE CART INFO
app.put("/checkout/:username", async (req, res) => {
  const username = req.params.username;
  const purchaseList = JSON.stringify(req.body.purchaseList);
  const id = req.body.id;
  const totalPrice = req.body.totalcost;

  if (purchaseList.length < 1) {
    console.log("no cart items");
    res.json({ message: "No items added to cart" });
  } else {
    // db.query(
    //   "UPDATE estoreusers SET purchaseList = ? WHERE id = ? AND username = ?",
    //   [purchaseList, id, username],
    //   (err) => {
    //     if (err) throw new Error(err);
    //     res.json({ message: "Successfully updated" });
    //   }
    // );

    db.query(
      "INSERT INTO purchaseHistory(userid,purchaseList,time,totalPrice) VALUES(?,?,now(),?)",
      [id, purchaseList, totalPrice],
      (err) => {
        if (err) console.error(err);
        res.json({ message: "succesfully added" });
      }
    );
  }
});

// SEND PRUCHASE HISTORY

app.get("/purchaseList/:id", (req, res) => {
  const id = req.params.id;

  console.log(id);

  db.query(
    "SELECT purchaseList, time, totalPrice FROM purchaseHistory WHERE userid = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.send({ message: "wrong info/error" });
      }

      let final = JSON.parse(JSON.stringify(result));
      if (final.length > 0) {
        setTimeout(() => {
          res.json(final);
        }, 5000);
      }
    }
  );
});

app.listen(PORT);

// SERVER RUNNING STATUS
console.log("server running on " + PORT);

const dt = new Date().toUTCString();

console.log(dt);

setTimeout(() => {
  console.log("timwout");
}, 2000);
