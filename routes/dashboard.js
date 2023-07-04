const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/getContact", adminController.getContact);
// router.get("/getAbout", verifyJWT, adminController.getAbout);
router.post(
  "/createAndUpdateContact",
  verifyJWT,
  adminController.createAndUpdateContact
);
// router.post("/UpdateAbout", verifyJWT, adminController.UpdateAbout);

module.exports = router;
