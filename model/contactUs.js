const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create User Schema

const Contact = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", Contact);
