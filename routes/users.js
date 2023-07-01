const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

const usersController = require("../controllers/usersController");
const adminController = require("../controllers/adminController");
//user
router.get("/getuser", verifyJWT, usersController.getUser);
router.get("/getAllUsers", verifyJWT, usersController.getAllUsers);
router.put("/updateUser", verifyJWT, usersController.updateUser);
//company
router.get("/getAllCompanies", verifyJWT, usersController.getAllCompanies);
router.get("/getcompany", verifyJWT, usersController.getCompany);
router.put("/updatecompany", verifyJWT, usersController.updateCompany);

//admin
router.put("/deleteUser/:id", verifyJWT, adminController.deleteUser);
router.put("/deleteCompany/:id", verifyJWT, adminController.deleteCompany);
//mutual
router.put("/updatePassword", verifyJWT, usersController.updatePassword);
router.get("/getAllCollectionsCounts", adminController.getCollectionCounts);
module.exports = router;
