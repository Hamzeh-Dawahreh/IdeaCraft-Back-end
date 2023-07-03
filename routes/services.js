const multer = require("multer");
const path = require("path");
const verifyJWT = require("../middleware/verifyJWT");
const express = require("express");
const servicesFormController = require("../controllers/servicesFromController");
const router = express.Router();
// Configure Multer to specify the destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check the file type and set the destination directory accordingly
    if (file.fieldname === "images") {
      cb(null, "images");
    } else if (file.fieldname === "reports") {
      cb(null, "reports");
    } else {
      cb(new Error("Invalid fieldname"));
    }
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/submitApplication",
  verifyJWT,
  upload.fields([{ name: "images", maxCount: 1 }]),
  servicesFormController.handleAddForm
);
router.get("/getRealEstate", servicesFormController.getRealEstate);
router.get("/getManufacturing", servicesFormController.getManufacturing);
router.get("/getTechnology", servicesFormController.getTechnology);
router.get("/getService", verifyJWT, servicesFormController.getService);
router.get("/getAllServices", verifyJWT, servicesFormController.getAllServices);
router.get(
  "/getTopRatedCompanies",
  servicesFormController.getTopRatedCompanies
);
router.put(
  "/deleteService/:id",
  verifyJWT,
  servicesFormController.deleteService
);
router.put(
  "/approveService/:id",
  verifyJWT,
  servicesFormController.approveService
);
module.exports = router;
