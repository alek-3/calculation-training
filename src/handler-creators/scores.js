module.exports = function(options, req) {
  let type = req.query["calctype"]; // ここでエラーになる。
  let difficulty = req.query["difficulty"];

  const conn = options.connection;
  const query = `
  SELECT
    a.player_name, a.result_time, a.game_type_id, a.difficulty_id, a.playing_date
  FROM result a
  INNER JOIN game_type b
  ON a.game_type_id = b.game_type_id
  INNER JOIN difficulty c
  ON a.difficulty_id = c.difficulty_id
  WHERE b.game_type_name = '`+type+`'
  AND c.difficulty_name = '`+difficulty+`'
  ORDER BY result_time;
  `;
  return function(req, res) {
    conn.query(query, function (error, results) {
      if (error) { console.log("err: " + error); }
      res.render("scores",{data: results});
    });
  };
};

