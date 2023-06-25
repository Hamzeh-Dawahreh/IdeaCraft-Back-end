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
    return res.status(400).send(" Images   are required");
  }

  const imagePaths = images.map((image) => image.path);

  // Check for duplicate forms in the database
  const duplicateForm = await form.findOne({ _id: req.body._id });
  if (duplicateForm) {
    return res.status(409).send({ message: "The form already exists" });
  }

  const newForm = new form({
    companyId: userId,
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
  newForm
    .save()
    .then(() => {
      res.status(200).send("Form saved successfully");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error saving form");
    });
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
module.exports = { handleAddForm, getRealEstate };
