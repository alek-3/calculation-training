module.exports = function(options) {
  const conn = options.connection;
  const query = `
  SELECT
    player_name, result_time, game_type_id, difficulty_id, playing_date
  FROM result
  ORDER BY result_time;
  `;
  return function(req, res) {
    conn.query(query, function (error, results) {
      if (error) { console.log("err: " + error); }
      res.render("scores",{data: results});
    });
  };
};

