const user = require("../model/user");

const getUser = async (req, res) => {
  const userId = req.user_id;

  const User = await user.findOne({ _id: userId }).exec();

  if (!User) {
    return res.status(204).json({ message: `User ID ${userId} not found` });
  }
  delete User.hashedPassword; // Remove the hashed password property
  return res.json(User);
};

const updateUser = async (req, res) => {
  const userId = req.user_id;
  const { companyname, industry, details, email } = req.body;

  try {
    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    User.companyname = companyname;
    User.industry = industry;
    User.details = details;
    User.email = email;

    // Save the updated user to the database
    await User.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUser, updateUser };
