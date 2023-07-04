const jwt = require("jsonwebtoken");
require("dotenv").config();
function jwtGenerator(user) {
  const payload = {
    user_id: user._id,
    username: user.username,
    companyname: user.companyname,
    role: user.role,
  };
  return jwt.sign(payload, process.env.jwtSecret);
}

module.exports = { jwtGenerator };
