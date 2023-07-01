const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create User Schema

const Admin = new Schema(
  {
    role: {
      type: String,
      default: "admin",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", Admin);
