const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();
const bookingController = require("../controllers/bookingController");
router.post("/userReq", verifyJWT, bookingController.handleRequest);

module.exports = router;
