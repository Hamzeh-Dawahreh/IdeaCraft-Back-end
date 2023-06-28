const user = require("../model/users");
const company = require("../model/companies");
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

module.exports = { getUser, updateCompany, getCompany };
