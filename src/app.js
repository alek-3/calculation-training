var express = require('express')
var session = require('express-session');
var app = express()
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
//  cookie: { secure: true }
})); // For session

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
  // Get type of game  
  if(req.body.calctype && req.body.difficulty){
    console.log('Set session');
    req.session.calctype =  req.body.calctype;
    req.session.difficulty =  req.body.difficulty;
  }
  let calctype = req.session.calctype;
  let difficulty = req.session.difficulty;
  
  // Set question number
  let num = 1;
  if(req.session.questionNum){
    if(req.session.firstnum + req.session.secondnum  == req.body.answer){
      num = req.session.questionNum + 1;
    }
    else{
      num = req.session.questionNum;
    }
  }
  req.session.questionNum = num;

  // Answer 10 questions -> Go to result page
  if(num > 10){
    res.render('results');
  }

  let firstnum = 1 + Math.floor( Math.random() * 9 ) ;
  let secondnum = 1 + Math.floor( Math.random() * 9 ) ;
  req.session.firstnum = firstnum;
  req.session.secondnum = secondnum;
  
  res.render('game', {message: calctype, message2: 'むずかしさ：' + difficulty, 
  qcount:'Q.'+num,  message3: firstnum+' + '+secondnum+' = ?'});
});

module.exports = app;
