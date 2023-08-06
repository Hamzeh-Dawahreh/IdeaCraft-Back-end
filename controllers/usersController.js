const user = require("../model/users");
const company = require("../model/companies");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const userId = req.user_id;

  const User = await user.findOne({ _id: userId }).select("-hashedPassword");

  if (!User) {
    return res.status(204).json({ message: `User ID ${userId} not found` });
  }
  delete User.hashedPassword; // Remove the hashed password property
  return res.json(User);
};
const getCompany = async (req, res) => {
  const userId = req.user_id;

  const User = await company.findOne({ _id: userId }).select("-hashedPassword");

  if (!User) {
    return res.status(204).json({ message: `User ID ${userId} not found` });
  }
  delete User.hashedPassword; // Remove the hashed password property
  return res.json(User);
};
const getAllUsers = async (req, res) => {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = 10;

    const totalCount = await user.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const allData = await user
      .find()
      .select("-hashedPassword")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      totalUsers: totalCount,
      totalPages,
      currentPage: pageNumber,
      users: allData,
    });
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const { page } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = 10;

    const totalCount = await company.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);

    const allData = await company
      .find()
      .select("-hashedPassword")
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      totalCompanies: totalCount,
      totalPages,
      currentPage: pageNumber,
      companies: allData,
    });
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};

const updateCompany = async (req, res) => {
  const userId = req.user_id;
  let { companyname, industry, details, email } = req.body;

  // Check if email and username properties exist in req.body
  if (!email || !companyname) {
    console.log("Email or username is missing in the request body.");
    return res.status(400).json({ error: "Missing email or username" });
  }

  // Convert email and username to lowercase
  email = email.toLowerCase();
  companyname = companyname.toLowerCase();

  const companyExists = await company.findOne({
    _id: { $ne: userId }, //exclude the current user from the search (Select all where ._id !=userId)
    $or: [{ email: email }, { companyname: companyname }],
  });

  if (companyExists) {
    if (companyExists.email === email) {
      return res.status(409).send({ Emessage: "Email already exists" });
    } else if (companyExists.companyname === companyname) {
      return res.status(409).send({ Umessage: "Company Name already exists" });
    }
  }

  try {
    const Company = await company.findById(userId);
    if (!Company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Update user details
    Company.companyname = companyname;
    Company.industry = industry;
    Company.details = details;
    Company.email = email;

    // Save the updated user to the database
    await Company.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateUser = async (req, res) => {
  const userId = req.user_id;
  let { firstname, lastname, username, email } = req.body;

  // Check if email and username properties exist in req.body
  if (!email || !username) {
    console.log("Email or username is missing in the request body.");
    return res.status(400).json({ error: "Missing email or username" });
  }

  // Convert email and username to lowercase
  email = email.toLowerCase();
  username = username.toLowerCase();

  const userExists = await user.findOne({
    _id: { $ne: userId }, //exclude the current user from the search (Select all where ._id !=userId)
    $or: [{ email: email }, { username: username }],
  });

  if (userExists) {
    if (userExists.email === email) {
      return res.status(409).send({ Emessage: "Email already exists" });
    } else if (userExists.username === username) {
      return res.status(409).send({ Umessage: "Username already exists" });
    }
  }

  try {
    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    User.username = username;
    User.firstname = firstname;
    User.lastname = lastname;
    User.email = email;

    // Save the updated user to the database
    await User.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updatePassword = async (req, res) => {
  const userId = req.user_id;
  const { oldPassword, newPassword } = req.body;
  const role = req.role;
  try {
    let User;
    // Check if the user is in the User collection
    if (role === "user") {
      User = await user.findById(userId);
    } else if (role === "company") {
      User = await company.findById(userId);
    }

    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided old password matches the user's current password
    const isMatch = await bcrypt.compare(oldPassword, User.hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    User.hashedPassword = hashedPassword;
    await User.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUser,
  updateCompany,
  getCompany,
  updatePassword,
  updateUser,
  getAllUsers,
  getAllCompanies,
};
