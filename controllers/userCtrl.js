const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Registered successfully!", success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: `Register Error: ${error.message}` });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Login Error: ${error.message}` });
  }
};

// Auth Controller
const authController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: `Auth Error: ${error.message}` });
  }
};

// Apply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });
    const notification = adminUser.notification;

    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await User.findByIdAndUpdate(adminUser._id, { notification });

    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Applying For Doctor",
      error: error.message,
    });
  }
};

// Get All Notifications
const getAllNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;

    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: 'All notifications marked as read',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Error in notification',
      success: false,
      error,
    });
  }
};

// Delete All Notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Unable to delete notifications',
      error,
    });
  }
};

// Get All Doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctors",
    });
  }
};

// Book Appointment Controller
const bookAppointmentController = async (req, res) => {
  try {
    const { doctorInfo, date, time, userInfo, userId, doctorId } = req.body;

    if (!doctorInfo || !date || !time || !userInfo || !userId || !doctorId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in the request.",
      });
    }

    // Create a new appointment record
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    // Notify the doctor about the new appointment
    const doctorUser = await User.findById(doctorInfo.userId);
    if (!doctorUser) {
      return res.status(404).json({
        success: false,
        message: "Doctor user not found",
      });
    }

    doctorUser.notification.push({
      type: 'New-appointment-request',
      message: `A new Appointment Request from ${userInfo.name}`,
      onClickPath: '/user/appointments',
    });

    await doctorUser.save();

    res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Booking Appointment",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
};
