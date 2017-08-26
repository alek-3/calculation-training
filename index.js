require("dotenv").config();

const app = require("./src/app.js");

// default to port 3000
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
