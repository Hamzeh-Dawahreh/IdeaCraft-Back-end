const express = require("express");
const router = express.Router();
const authUserController = require("../controllers/authUserController");
const authCompanyController = require("../controllers/authCompanyController");

router.post("/authUser", authUserController.handleLogin);
router.post("/authCompany", authCompanyController.handleLogin);

module.exports = router;
