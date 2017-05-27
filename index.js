var express = require('express')
var app = express()

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
app.get('/foo', function(req, res) {
  // get name from URL parameter
  // http://localhost:3000/foo?name=foo
  let name = req.query['name'] || 'nanasi';
  res.render('foo', {title: 'greeting', message: 'Hello ' + name + '-san.'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
