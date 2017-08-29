module.exports = function(options) {
  const client = options.client;

  return function(req, res) {
    let type = req.query["calctype"];
    let difficulty = req.query["difficulty"];
    if(type == null || difficulty == null){
      type = "たしざん";
      difficulty = "かんたん";
    }
    const query = `
      SELECT
        a.player_name, a.result_time, a.playing_date + INTERVAL 9 HOUR AS playing_date
      FROM result a
      INNER JOIN game_type b
      ON a.game_type_id = b.game_type_id
      INNER JOIN difficulty c
      ON a.difficulty_id = c.difficulty_id
      WHERE b.game_type_name = $1 
      AND c.difficulty_name = $2 
      ORDER BY result_time
      LIMIT 10;
      `;

    client.query(query, [type, difficulty], function (error, results) {
      if (error) { console.log("err: " + error);
        return res.status(500).render("500");
      }
      res.render("scores",{data: results, calctype: type, difficulty: difficulty});
    });
  };
};