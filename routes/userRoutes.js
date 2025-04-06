const express = require("express");
const { registerController, loginController, authController,applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorsController} = require("../controllers/userCtrl");
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

module.exports = router;
