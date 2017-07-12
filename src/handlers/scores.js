const mysql = require("mysql");
const connection = mysql.createConnection({
  host : "127.0.0.1",
  user : "root",
  password : "password",
  database: "calc_training"
});

module.exports = function(req, res){
  connection.query("SELECT player_name, result_time, game_type_id, difficulty_id, playing_date FROM result ORDER BY result_time;", function (error, results) {
    if (error) { console.log("err: " + error); } 
    res.render("scores",{data: results});
  });
};