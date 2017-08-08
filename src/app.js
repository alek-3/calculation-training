var express = require("express");
var session = require("express-session");
var app = express();
var bodyParser = require("body-parser");
const mysql = require("mysql");
const connection = mysql.createConnection({
  host : "127.0.0.1",
  user : "root",
  password : "password",
  database: "calc_training",
  timezone: "jst"
});
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


const homeHandler = require("./handlers/home.js");
app.get("/home", homeHandler);
app.post("/home", homeHandler);

app.get("/signin", function(req, res) {
  res.render("signin");
});

app.post("/index.html", function(req, res) {
  console.log("Enter into index.html");
  res.render("/index.html");
});

const gameHandlerCreator = require("./handler-creators/game.js");
const gameHandler = gameHandlerCreator({connection: connection});
app.post("/game", gameHandler);

const scoresHandlerCreator = require("./handler-creators/scores.js");
const scoresHandler = scoresHandlerCreator({connection: connection});
app.get("/scores", scoresHandler);

app.get("/sqlsample", function(){
  connection.connect();
  connection.query("SELECT player_name, result_time FROM result;", function (error, results) {
    if (error) { console.log("err: " + error); } 

    console.log("プレーヤー名: "+ results[0].player_name);
    console.log("タイム: "+ results[0].result_time);
  });
  connection.end();
});

module.exports = app;
