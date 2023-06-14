const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/getuser", usersController.getUser);
router.put("/updateuser", usersController.updateUser);
module.exports = router;
