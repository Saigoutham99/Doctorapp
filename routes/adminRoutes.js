const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController } = require("../controllers/adminCtrl");


const router = express.Router();

//get method||users
router.get("/getAllUsers", authMiddleware,getAllUsersController);

//get method||Doctors
router.get("/getAllDoctors",authMiddleware,getAllDoctorsController)

//POST ACCOUNT STATUS
router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController)

module.exports = router;