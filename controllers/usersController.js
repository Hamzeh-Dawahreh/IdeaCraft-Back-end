const user = require("../model/users");
const company = require("../model/companies");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const userId = req.user_id;

  const User = await user.findOne({ _id: userId });

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

const updateCompany = async (req, res) => {
  const userId = req.user_id;
  const { companyname, industry, details, email } = req.body;
  const companyExists = await company.findOne({
    _id: { $ne: userId }, //exclude the current user from the search
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
const updatePassword = async (req, res) => {
  const userId = req.user_id;
  const { oldPassword, newPassword } = req.body;

  try {
    let User;
    // Check if the user is in the User collection
    User = await user.findById(userId);

    // If not found in the User collection, check the Company collection
    if (!User) {
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

module.exports = { getUser, updateCompany, getCompany, updatePassword };
