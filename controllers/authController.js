const user = require("../model/user");
const bcrypt = require("bcrypt");
const { JWTgenerator } = require("../utilities/JWTgenerator");
const handleLogin = async (req, res) => {
  const { username, passwprd } = req.body;
  if (!username || !passwprd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
};
const foundUser = await user.findOne({ username: username }).exec();
if (!foundUser) return res.sendStatus(401); //Unauthorized

const match = await bcrypt.compare(password, foundUser.password);
if (match) {
  const token = JWTgenerator(login);
  res.status(200).json({ token });
} else {
  res.sendStatus(401);
}
