const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/getContact", adminController.getContact);
router.post(
  "/createAndUpdateContact",
  verifyJWT,
  adminController.createAndUpdateContact
);

module.exports = router;
