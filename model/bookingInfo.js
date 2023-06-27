const mongoose = require("mongoose");

const bookingInfo = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
    },

    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "applicationForm", // Referencing the User model

      required: true,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company", // Referencing the company model

      required: true,
    },
    userReq: {
      type: String,
    },
    companyRes: {
      type: String,
    },
    price: {
      type: Number,
    },
    userConsent: {
      type: Boolean,
    },
    companyConsent: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingInfo);

module.exports = Booking;
