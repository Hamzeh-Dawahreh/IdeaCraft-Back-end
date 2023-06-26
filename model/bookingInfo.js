const mongoose = require("mongoose");

const bookingInfo = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: true,
    },

    service_id: {
      type: String,
      required: true,
    },
    company_id: {
      type: String,
      required: true,
    },
    userReq: {
      type: String,
    },
    companyRes: {
      type: String,
      default: "",
    },
    userConsent: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingInfo);

module.exports = Booking;
