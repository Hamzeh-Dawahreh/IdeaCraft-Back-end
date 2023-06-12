const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    username: String,
    companyname: String,
    industry: String,

    email: String,
    hashedPassword: {
      type: String,
      required: true,
    },
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
