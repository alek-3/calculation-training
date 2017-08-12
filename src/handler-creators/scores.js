module.exports = function(options) {
  const conn = options.connection;

  return function(req, res) {
    let type = req.query["calctype"]; 
    let difficulty = req.query["difficulty"];
    if(type == null || difficulty == null){
      type = "たしざん";
      difficulty = "かんたん";
    }
    let query = `
      SELECT
        a.player_name, a.result_time, a.playing_date + INTERVAL 9 HOUR AS playing_date
      FROM result a
      INNER JOIN game_type b
      ON a.game_type_id = b.game_type_id
      INNER JOIN difficulty c
      ON a.difficulty_id = c.difficulty_id
      WHERE b.game_type_name = ? 
      AND c.difficulty_name = ? 
      ORDER BY result_time
      LIMIT 10;
      `;

    conn.query(query, [type, difficulty], function (error, results) {
      if (error) { console.log("err: " + error); 
        return res.status(500).render("500");
      }
      res.render("scores",{data: results, calctype: type, difficulty: difficulty});
    });
  };
};