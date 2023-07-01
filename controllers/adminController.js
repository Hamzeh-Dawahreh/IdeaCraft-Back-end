const bcrypt = require("bcrypt");
const admin = require("../model/admin");
const user = require("../model/users");
const company = require("../model/companies");
const { jwtGenerator } = require("../utilities/JWTgenerator");

const handleNewUser = async (req, res) => {
  const { role, fullName, email, phone, password } = req.body;
  // Check for duplicate usernames and emails in the db
  const duplicateEmail = await admin.findOne({ email: email }).exec();

  if (duplicateEmail) {
    return res.status(409).send({ Emessage: " Email already exists" }); //Conflict
  }
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newAdmin = new admin({
    role: role,
    fullName: fullName,
    email: email,
    password: hashedPassword,
  });

  // Save the user to the database
  newAdmin
    .save()
    .then(() => {
      const token = jwtGenerator(newAdmin);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error registering user");
    });
};
const handleLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "email and password are required." });
  email = email.toLowerCase();

  try {
    const foundUser = await admin.findOne({ email: email });
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);

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
const deleteUser = async (req, res) => {
  const adminRole = req.role;
  if (adminRole === "admin") {
    try {
      const { id } = req.params;
      const { isDeleted } = req.body;
      const deleteUser = await user.findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: isDeleted } },
        { new: true }
      );

      return res.send("User Deleted");
    } catch (error) {
      // Handle any errors that occur during the database query
      return res.status(500).json({ message: "Error retrieving user data" });
    }
  } else {
    return res.status(400).json({ message: "User must be admin" });
  }
};
const deleteCompany = async (req, res) => {
  const adminRole = req.role;
  if (adminRole === "admin") {
    try {
      const { id } = req.params;
      const { isDeleted } = req.body;
      const deleteUser = await company.findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: isDeleted } },
        { new: true }
      );

      return res.send("User Deleted");
    } catch (error) {
      // Handle any errors that occur during the database query
      return res.status(500).json({ message: "Error retrieving user data" });
    }
  } else {
    return res.status(400).json({ message: "User must be admin" });
  }
};

module.exports = { handleNewUser, handleLogin, deleteUser, deleteCompany };
