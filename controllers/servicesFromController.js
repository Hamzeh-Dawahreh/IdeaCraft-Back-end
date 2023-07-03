const ApplicationForm = require("../model/applicationForm");
const Company = require("../model/companies");
const handleAddForm = async (req, res) => {
  const files = req.files;
  const userId = req.user_id;

  const { phone, country, city, description } = req.body;
  if (!files) {
    return res.status(400).send("No files provided");
  }

  const images = files["images"]; // Array of image files

  if (!images) {
    return res.status(400).send("Images are required");
  }

  const imagePaths = images.map((image) => image.path);

  try {
    // Check for duplicate forms in the database
    let existingService = await ApplicationForm.findOne({ company_id: userId });

    if (existingService) {
      // Update the existing ApplicationForm  with the incoming data
      existingService.phone = phone;
      existingService.country = country;
      existingService.city = city;
      existingService.description = description;
      existingService.Images = imagePaths;
      existingService.isDeleted = false;
      existingService.isApproved = undefined;
      await existingService.save();

      return res.status(200).send("Form updated successfully");
    }

    // If no existing ApplicationForm  found, create a new one
    const newForm = new ApplicationForm({
      company_id: userId,
      phone: phone,
      country: country,
      city: city,
      description: description,
      Images: imagePaths,
    });

    // Save the ApplicationForm  to the database
    await newForm.save();
    res.status(200).send("Form saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving/updating ApplicationForm ");
  }
};

const getRealEstate = async (req, res) => {
  // const industry = req.params
  try {
    const allData = await ApplicationForm.find({
      isApproved: true,
      isDeleted: false,
    }).populate({
      path: "company_id",
      select: "-hashedPassword",
      match: { industry: "Real Estates" },
    });
    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};
const getTechnology = async (req, res) => {
  try {
    const allData = await ApplicationForm.find({
      isApproved: true,
      isDeleted: false,
    }).populate({
      path: "company_id",
      select: "-hashedPassword",
      match: { industry: "Technology" },
    });
    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};
const getManufacturing = async (req, res) => {
  try {
    const allData = await ApplicationForm.find({
      isApproved: true,
      isDeleted: false,
    }).populate({
      path: "company_id",
      select: "-hashedPassword",
      match: { industry: "Manufacturing" },
    });
    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};
const getAllServices = async (req, res) => {
  const industries = ["Real Estates", "Technology", "Manufacturing"];

  try {
    const allData = await ApplicationForm.find().populate({
      path: "company_id",
      select: "-hashedPassword",
      match: { industry: { $in: industries } },
    });
    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};
const getTopRatedCompanies = async (req, res) => {
  const industries = ["Real Estates", "Technology", "Manufacturing"];
  const topCompaniesPerField = 9; // Number of top companies to retrieve per field

  try {
    const allData = await Company.aggregate([
      { $match: { industry: { $in: industries } } },
      { $sort: { rating: -1 } },
      { $limit: topCompaniesPerField },
      {
        $lookup: {
          from: "applicationforms",
          localField: "_id",
          foreignField: "company_id",
          as: "applicationForm",
        },
      },
      {
        $project: {
          _id: 1,
          companyname: 1,
          industry: 1,
          rating: 1,
          applicationForm: {
            $ifNull: [
              { $arrayElemAt: ["$applicationForm", 0] },
              { Images: [], description: "" },
            ],
          },
        },
      },
    ]);

    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ error: "An error occurred while getting data" });
  }
};

const getService = async (req, res) => {
  const company_id = req.user_id;
  try {
    const service = await ApplicationForm.findOne({
      company_id: company_id,
      isDeleted: { $ne: true },
    }).populate("company_id", "-hashedPassword");

    return res.json({ service });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDeleted } = req.body;
    const deleteService = await ApplicationForm.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: isDeleted } },
      { new: true }
    );

    return res.send("Service Deleted");
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};
const approveService = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const message = isApproved == true ? "approved" : "declined";
    const existingService = await ApplicationForm.findOne({ _id: id });

    if (existingService.isApproved == isApproved) {
      return res.send({ message: `Service is already ${message}` });
    }

    const updatedService = await ApplicationForm.findOneAndUpdate(
      { _id: id },
      { $set: { isApproved: isApproved } },
      { new: true }
    );

    return res.send(`Service ${message}`);
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports = {
  handleAddForm,
  getRealEstate,
  getManufacturing,
  getTechnology,
  getService,
  getAllServices,
  deleteService,
  approveService,
  getTopRatedCompanies,
};
