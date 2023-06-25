const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
router.post("/newuser", registerController.handleNewUser);
router.post("/newcompany", registerController.handleNewCompany);
module.exports = router;
