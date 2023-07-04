const user = require("../model/users");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utils/JWTgenerator");

const handleLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });
  email = email.toLowerCase(); // Convert email to lowercase

  try {
    const foundUser = await user.findOne({ email: email });

    if (!foundUser) {
      return res.status(401).json({
        error:
          "There is no account with this email address! Make sure you are choosing the right role.",
      });
    }

    if (foundUser.isDeleted) {
      return res.status(401).json({
        message:
          "Your account has been deleted. Please contact us for further assistance.",
      });
    }

    const match = await bcrypt.compare(password, foundUser.hashedPassword);
    if (match) {
      const token = jwtGenerator(foundUser);
      res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    // Handle any errors that occur during the login process
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
