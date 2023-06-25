const company = require("../model/companys");
const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utilities/JWTgenerator");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });

  try {
    const foundCompany = await company.findOne({ email: email });
    if (!foundCompany) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(password, foundCompany.hashedPassword);
    if (match) {
      const token = jwtGenerator(foundCompany);
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
