const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyname: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const company = mongoose.model("company", companySchema);

module.exports = company;
