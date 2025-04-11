const express = require("express");
const { registerController, loginController, authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorsController, bookAppointmentController, bookingAvailabilityController, userAppointmentsController} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

//get all doc
router.get('/getAllDoctors', authMiddleware,getAllDoctorsController )

//Book Appointment 
router.post('/book-appointment', authMiddleware,bookAppointmentController)

//Booking Availability
router.post('/booking-availability', authMiddleware, bookingAvailabilityController)

//Appointments List
router.get('/user-appointments', authMiddleware,userAppointmentsController )

module.exports = router;
