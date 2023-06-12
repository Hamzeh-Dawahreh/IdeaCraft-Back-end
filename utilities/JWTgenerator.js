const jwt = require("jsonwebtoken");
require("dotenv").config();
function jwtGenerator(user) {
  const payload = {
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, process.env.jwtSecret);
}

module.exports = { jwtGenerator };
