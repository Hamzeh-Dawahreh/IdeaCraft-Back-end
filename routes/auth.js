const express = require("express");
const router = express.Router();
const authUserController = require("../controllers/authUserController");
const authCompanyController = require("../controllers/authCompanyController");
const adminController = require("../controllers/adminController");
router.post("/authUser", authUserController.handleLogin);
router.post("/authCompany", authCompanyController.handleLogin);
router.post("/authAdmin", adminController.handleLogin);
router.post("/google", authUserController.handleGoogleLoginorCreate);

module.exports = router;
