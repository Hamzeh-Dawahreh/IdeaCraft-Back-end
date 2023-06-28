const form = require("../model/applicationForm");
const handleAddForm = async (req, res) => {
  const files = req.files;
  const userId = req.user_id;

  const { companyname, industry, phone, email, country, city, description } =
    req.body;
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
    let existingForm = await form.findOne({ company_id: userId });

    if (existingForm) {
      // Update the existing form with the incoming data
      existingForm.companyname = companyname;
      existingForm.industry = industry;
      existingForm.phone = phone;
      existingForm.email = email;
      existingForm.country = country;
      existingForm.city = city;
      existingForm.description = description;
      existingForm.Images = imagePaths;

      await existingForm.save();

      return res.status(200).send("Form updated successfully");
    }

    // If no existing form found, create a new one
    const newForm = new form({
      company_id: userId,
      companyname: companyname,
      industry: industry,
      phone: phone,
      email: email,
      country: country,
      city: city,
      description: description,
      Images: imagePaths,
    });

    // Save the form to the database
    await newForm.save();
    res.status(200).send("Form saved successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving/updating form");
  }
};

const getRealEstate = async (req, res) => {
  try {
    const allData = await form.find({ industry: "Real Estates" });
    res.status(200).json(allData);
  } catch (err) {
    console.log("Error retrieving data:", err);
    res.status(500).json({ err: "An error occurred while getting data" });
  }
};
const getService = async (req, res) => {
  const company_id = req.user_id;

  try {
    const bookings = await form.findOne({ company_id: company_id });

    return res.json({ bookings });
  } catch (error) {
    // Handle any errors that occur during the database query
    return res.status(500).json({ message: "Error retrieving user data" });
  }
};

module.exports = { handleAddForm, getRealEstate, getService };
