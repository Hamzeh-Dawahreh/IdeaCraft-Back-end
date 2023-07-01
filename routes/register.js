const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
const adminController = require("../controllers/adminController");
router.post("/newuser", registerController.handleNewUser);
router.post("/newcompany", registerController.handleNewCompany);
router.post("/createAdmin", adminController.handleNewUser);

module.exports = router;
