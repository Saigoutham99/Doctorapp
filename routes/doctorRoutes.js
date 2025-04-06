const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDoctorInfoController,updateProfileController, getDoctorByIdController } = require("../controllers/doctorCtrl");
const router = express.Router();

// Route to get doctor's info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//post Update Profile 
router.post('/updateProfile', authMiddleware,updateProfileController);

//post GetSingle Doc Info
router.post('/getDoctorById', authMiddleware, getDoctorByIdController )

module.exports = router;
