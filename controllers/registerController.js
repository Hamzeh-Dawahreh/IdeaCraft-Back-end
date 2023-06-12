const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utilities/JWTgenerator");
const user = require("../model/user");
const handleNewUser = async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    role,
    companyname,
    industry,
  } = req.body;
  // Check for duplicate usernames and emails in the db
  const duplicateUsername = await user.findOne({ username: username }).exec();
  const duplicateEmail = await user.findOne({ email: email }).exec();

  if (duplicateUsername) {
    return res.status(409).send({ Umessage: " Username already exists" });
  }

  if (duplicateEmail) {
    return res.status(409).send({ Emessage: " Email already exists" });
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new user({
    firstname,
    lastname,
    username,
    email,
    hashedPassword,
    role,
    companyname,
    industry,
  });

  // Save the user to the database
  newUser
    .save()
    .then(() => {
      const token = jwtGenerator(newUser);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error registering user");
    });
};
module.exports = { handleNewUser };
