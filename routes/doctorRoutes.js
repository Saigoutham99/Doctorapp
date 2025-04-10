const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController } = require("../controllers/doctorCtrl");
const router = express.Router();

// Route to get doctor's info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// Route to update doctor profile
router.post('/updateProfile', authMiddleware, updateProfileController);

// Route to get single doctor info by doctorId
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

module.exports = router;
