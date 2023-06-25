const mongoose = require("mongoose");

const bookingInfo = new mongoose.Schema(
  {
    user_id: {
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
    },
    userConsent: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingInfo);

module.exports = Booking;
