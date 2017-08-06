module.exports = function(req, res) {
  let name;
  if(req.session.username){
    name = req.session.username;
  }
  else{
    name = req.body.username || "nanasi";
    req.session.username = name;
  }
  res.render("home", {title: "Home", message: "ようこそ、" + name + "さん。"});
  return;
};