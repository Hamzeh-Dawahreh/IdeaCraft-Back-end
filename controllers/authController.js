const user = require("../model/user");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utilities/JWTgenerator");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  try {
    const foundUser = await user.findOne({ email: email }).exec();

    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(password, foundUser.hashedPassword);
    if (match) {
      const token = jwtGenerator(foundUser);
      res.status(200).json({ token });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    // Handle any errors that occur during the login process
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
