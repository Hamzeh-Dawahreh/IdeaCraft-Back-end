const bookingInfo = require("../model/bookingInfo");

const handleRequest = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { userReq, service_id, company_id } = req.body;

    // Create a new document in the bookingInfo collection
    const newBooking = new bookingInfo({
      userReq: userReq,
      user_id: user_id,
      service_id: service_id,
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
const getRequest = async (req, res) => {
  const user_id = req.user_id;

  try {
    const bookings = await bookingInfo
      .find({ company_id: user_id })
      .populate("user_id", "-hashedPassword"); // Exclude the hashedPassword field

    if (!bookings) {
      return res.status(204).json({ message: `User ID ${user_id} not found` });
    }

    return res.json({ bookings });
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};
const companyRes = async (req, res) => {
  const company_id = req.user_id;

  const { companyRes } = req.body;

  try {
    // Check if the provided IDs match a record in the database
    const booking = await bookingInfo.findOne({
      company_id: company_id,
    });

    if (!booking) {
      return res.status(404).json({ message: "No matching record found" });
    }

    // Matching IDs, update the company response in the database
    booking.companyRes = companyRes;
    await booking.save();

    return res
      .status(200)
      .json({ message: "Company response saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { handleRequest, getRequest, companyRes };
