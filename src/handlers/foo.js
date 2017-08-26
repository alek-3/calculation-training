module.exports = function(req, res) {
  // get name from URL parameter
  // http://localhost:3000/foo?name=foo
  const kibun = req.query["kibun"] || "so-so";
  res.render("foo", {message2: "You are "+kibun+ " now."} );

  // let name = req.query['name'] || 'nanasi';
  // res.render('foo', {title: 'greeting', message: 'Hello ' + name + '-san.'});
};
