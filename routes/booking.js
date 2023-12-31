const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.post("/userReq", verifyJWT, bookingController.handleRequest);
router.get("/getRequest", verifyJWT, bookingController.getRequest);
router.post("/companyRes", verifyJWT, bookingController.companyRes);
router.get("/getResponse", verifyJWT, bookingController.getResponse);
router.get("/getBooking/:id", verifyJWT, bookingController.getBooking);
router.post("/companyConsent", verifyJWT, bookingController.companyConsent);
router.post("/userConsent", verifyJWT, bookingController.userConsent);
router.post("/userRating", verifyJWT, bookingController.userRating);

module.exports = router;
