var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
//  cookie: { secure: true }
})); // For session

app.use(express.static("public"));

// handling GET
app.get("/test", function(req, res) {
  res.send("GET /test");
});
// handling POST
app.post("/test", function(req, res) {
  res.send("POST /test");
});

// Use pug as our template engine
app.set("view engine", "pug");
// templates are in ./views
app.set("views", "./views");

const fooHandler = require("./handlers/foo.js");

app.get("/foo", fooHandler);

app.post("/home", function(req, res) {
  let name = req.body.username || "nanasi";
  res.render("home", {title: "Home", message: "ようこそ、" + name + "さん。"});
});

app.get("/signin", function(req, res) {
  res.render("signin");
});

app.post("/index.html", function(req, res) {
  console.log("Enter into index.html");
  res.render("/index.html");
});

const gameHandler = require("./handlers/game.js");
app.post("/game", gameHandler);

module.exports = app;
