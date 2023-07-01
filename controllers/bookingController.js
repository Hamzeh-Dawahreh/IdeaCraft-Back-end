const bookingInfo = require("../model/bookingInfo");
const companys = require("../model/companies");
const handleRequest = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { userReq, service_id, company_id } = req.body;
    const alreadyBooked = await bookingInfo.findOne({
      user_id: user_id,
      service_id: service_id,
      company_id: company_id,
    });
    if (alreadyBooked) {
      return res
        .status(409)
        .send({ message: " You have already booked this service" });
    }
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
  const { companyRes, user_id, service_id, price, companyConsent } = req.body;

  try {
    // Check if userConsent value already exists in the database
    const existingBooking = await bookingInfo.findOne({
      company_id: company_id,
      user_id: user_id,
      service_id: service_id,
    });
    if (existingBooking && existingBooking.companyConsent !== undefined) {
      // User consent value already exists
      return res.status(200).json({
        Errormessage: `You have already ${
          existingBooking.companyConsent ? "approved" : "rejected"
        }`,
      });
    }
    // Find and update the existing document in the bookingInfo collection
    const updatedBooking = await bookingInfo.findOneAndUpdate(
      {
        company_id: company_id,
        user_id: user_id,
        service_id: service_id,
      },
      { companyRes: companyRes, price: price, companyConsent: companyConsent },
      { new: true } // To return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "No matching record found" });
    }

    return res
      .status(200)
      .json({ message: "Company response updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const getResponse = async (req, res) => {
  const user_id = req.user_id;

  try {
    const bookings = await bookingInfo
      .find({ user_id: user_id })
      .populate("company_id", "-hashedPassword"); // Exclude the hashedPassword field

    if (!bookings) {
      return res.status(204).json({ message: `User ID ${user_id} not found` });
    }

    return res.json({ bookings });
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};
const getBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const bookings = await bookingInfo
      .findOne({ _id: id })
      .populate("company_id", "-hashedPassword"); // Exclude the hashedPassword field

    if (!bookings) {
      return res.status(204).json({ message: `No bookings found` });
    }

    return res.json({ bookings });
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};
const userConsent = async (req, res) => {
  const user_id = req.user_id;
  const { company_id, userConsent, service_id } = req.body;

  try {
    // Check if userConsent value already exists in the database
    const existingBooking = await bookingInfo.findOne({
      company_id: company_id,
      user_id: user_id,
      service_id: service_id,
    });
    if (existingBooking && existingBooking.userConsent !== undefined) {
      // User consent value already exists
      return res.status(200).json({
        Errormessage: `You have already ${
          existingBooking.userConsent ? "approved" : "rejected"
        }`,
      });
    }

    // Find and update the existing document in the bookingInfo collection
    const updatedBooking = await bookingInfo.findOneAndUpdate(
      {
        company_id: company_id,
        user_id: user_id,
        service_id: service_id,
      },
      { userConsent: userConsent },
      { new: true } // To return the updated document
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "No matching record found" });
    }

    return res
      .status(200)
      .json({ message: "Company response updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const companyConsent = async (req, res) => {
  const company_id = req.user_id;
  const { user_id, companyConsent, service_id, companyRes } = req.body;

  try {
    // Check if userConsent value already exists in the database
    const existingBooking = await bookingInfo.findOne({
      company_id: company_id,
      user_id: user_id,
      service_id: service_id,
    });
    if (existingBooking && existingBooking.companyConsent !== undefined) {
      // User consent value already exists
      return res.status(200).json({
        Errormessage: `You have already ${
          existingBooking.companyConsent ? "approved" : "rejected"
        }`,
      });
    }

    // Find and update the existing document in the bookingInfo collection
    const updatedBooking = await bookingInfo.findOneAndUpdate(
      {
        company_id: company_id,
        user_id: user_id,
        service_id: service_id,
      },
      { companyConsent: companyConsent, companyRes: companyRes },
      { new: true } // To return the updated document
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "No matching record found" });
    }

    return res
      .status(200)
      .json({ message: "Company response updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const userRating = async (req, res) => {
  const user_id = req.user_id;
  const { company_id, rating, service_id } = req.body;

  try {
    // Update the rating in the bookingInfo collection
    const updateRating = await bookingInfo.findOneAndUpdate(
      {
        company_id: company_id,
        user_id: user_id,
        service_id: service_id,
      },
      { rating: rating },
      { new: true } // To return the updated document
    );

    if (!updateRating) {
      return res.status(404).json({ message: "No matching record found" });
    }

    // Calculate the new rating for the company
    const ratings = await bookingInfo.find(
      { company_id: company_id },
      { rating: 1 }
    );

    let totalRating = 0;
    ratings.forEach((booking) => {
      totalRating += booking.rating;
    });

    const averageRating = (totalRating / ratings.length).toFixed(1);

    // Update the rating in the companys collection
    const updatedCompany = await companys.findOneAndUpdate(
      {
        _id: company_id,
      },
      { rating: averageRating },
      { new: true }
    );
    console.log("updatedCompany", updatedCompany);
    console.log("company_id", company_id);
    console.log("averageRating", averageRating);
    return res.status(200).json({ message: "Rating updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleRequest,
  getRequest,
  companyRes,
  getResponse,
  getBooking,
  userConsent,
  companyConsent,
  userRating,
};
