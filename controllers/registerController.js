const bcrypt = require("bcrypt");
const { jwtGenerator } = require("../utilities/JWTgenerator");
const user = require("../model/users");
const company = require("../model/companies");
const handleNewUser = async (req, res) => {
  let { firstname, lastname, username, email, password, role } = req.body;

  // Check if email and username properties exist in req.body
  if (!email || !username) {
    console.log("Email or username is missing in the request body.");
    return res.status(400).json({ error: "Missing email or username" });
  }

  // Convert email and username to lowercase
  email = email.toLowerCase();
  username = username.toLowerCase();

  // Check for duplicate usernames and emails in the db
  const duplicateUsername = await user.findOne({ username: username });
  const duplicateEmail = await user.findOne({ email: email });

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
const handleNewCompany = async (req, res) => {
  let { companyname, industry, email, password, role } = req.body;

  // Check if email and username properties exist in req.body
  if (!email || !username) {
    console.log("Email or username is missing in the request body.");
    return res.status(400).json({ error: "Missing email or username" });
  }

  // Convert email and username to lowercase
  email = email.toLowerCase();
  companyname = companyname.toLowerCase();

  // Check for duplicate usernames and emails in the db
  const duplicateEmail = await company.findOne({ email: email });
  const duplicateCompanyname = await company.findOne({
    companyname: companyname,
  });

  if (companyname == null && duplicateCompanyname) {
    return res.status(409).send({ Umessage: " Company Name already exists" });
  }

  if (duplicateEmail) {
    return res.status(409).send({ Emessage: " Email already exists" });
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newCompany = new company({
    email,
    hashedPassword,
    role,
    companyname,
    industry,
  });

  newCompany
    .save()
    .then(() => {
      const token = jwtGenerator(newCompany);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error registering user");
    });
};
module.exports = { handleNewUser, handleNewCompany };
