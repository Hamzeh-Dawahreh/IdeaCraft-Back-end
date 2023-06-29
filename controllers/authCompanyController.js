const company = require("../model/companies");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utilities/JWTgenerator");

const handleLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  email = email.toLowerCase(); // Convert email to lowercase

  try {
    const foundCompany = await company.findOne({ email: email });
    if (!foundCompany) {
      return res.status(401).json({
        error:
          "There is no account with this email address! Make sure you are choosing the right role.",
      });
    }
    const match = await bcrypt.compare(password, foundCompany.hashedPassword);
    if (match) {
      const token = jwtGenerator(foundCompany);
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
