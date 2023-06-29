const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.jwtSecret); // Verify the JWT token
    const userId = decodedToken.user_id; // Extract the user ID from the token payload
    req.user_id = userId;
    const role = decodedToken.role;
    req.role = role;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = verifyJWT;
