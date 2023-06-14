const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController");
router.post("/newuser", registerController.handleNewUser);
module.exports = router;
