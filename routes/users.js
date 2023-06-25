const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

const usersController = require("../controllers/usersController");

router.get("/getuser", verifyJWT, usersController.getUser);
router.get("/getcompany", verifyJWT, usersController.getCompany);
router.put("/updatecompany", verifyJWT, usersController.updateCompany);
module.exports = router;
