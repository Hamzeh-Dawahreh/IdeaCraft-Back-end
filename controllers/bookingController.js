const bookingInfo = require("../model/bookingInfo");

const handleRequest = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { userReq, company_id } = req.body;

    // Create a new document in the bookingInfo collection
    const newBooking = new bookingInfo({
      userReq: userReq,
      user_id: user_id,
      company_id: company_id,
    });

    // Save the new document to the database
    const savedBooking = await newBooking.save();

    res.status(200).json(savedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleRequest };
