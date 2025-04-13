const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } = require("../controllers/doctorCtrl");
const router = express.Router();

// Route to get doctor's info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// Route to update doctor profile
router.post('/updateProfile', authMiddleware, updateProfileController);

// Route to get single doctor info by doctorId
router.post('/getDoctorById', authMiddleware, getDoctorByIdController);

//get Appointments
router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);

//post Update appointment Status;
router.post('/update-status', authMiddleware, updateStatusController)

module.exports = router;
