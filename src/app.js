var express = require('express')
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'))

// handling GET
app.get('/test', function(req, res) {
  res.send("GET /test");
});
// handling POST
app.post('/test', function(req, res) {
  res.send("POST /test");
});

// Use pug as our template engine
app.set('view engine', 'pug');
// templates are in ./views
app.set('views', './views');

const fooHandler = require('./handlers/foo.js');

app.get('/foo', fooHandler);

app.post('/home', function(req, res) {
  let name = req.body.username || 'nanasi';
  res.render('home', {title: 'Home', message: 'ようこそ、' + name + 'さん。'});
});

app.get('/signin', function(req, res) {
  res.render('signin');
});

app.post('/index.html', function(req, res) {
  console.log('Enter into index.html');
  res.render('/index.html');
});

app.post('/game', function(req, res) {
  let calctype = req.body.calctype;
  let difficulty = req.body.difficulty;
  let num = 1;
  let firstnum = Math.floor( Math.random() * 10 ) ;
  let secondnum = Math.floor( Math.random() * 10 ) ;
  res.render('game', {message: calctype, message2: 'むずかしさ：' + difficulty, 
  qcount:'Q.'+num,  message3: firstnum+' + '+secondnum+' = ?'});
});

module.exports = app;
