const doctorModel = require('../models/doctorModel');
const moment = require('moment');

// Controller to get doctor info
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found", success: false });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor data fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor info:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor details',
      error: error.message,
    });
  }
};

// Controller to update doctor profile
const updateProfileController = async (req, res) => {
  try {
    const { userId, timings, ...restFields } = req.body;

    if (timings && Array.isArray(timings) && timings.length === 2) {
      const formattedTimings = [
        moment(timings[0], "HH:mm").isValid() ? moment(timings[0], "HH:mm").format("HH:mm") : '',
        moment(timings[1], "HH:mm").isValid() ? moment(timings[1], "HH:mm").format("HH:mm") : '',
      ];

      const doctor = await doctorModel.findOneAndUpdate(
        { userId },
        { ...restFields, timings: formattedTimings },
        { new: true }
      );

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found", success: false });
      }

      res.status(200).json({
        success: true,
        message: "Doctor Profile Updated",
        data: doctor,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid timings format. Please provide valid start and end times.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error updating doctor profile',
      error: error.message,
    });
  }
};

// Controller to get a single doctor by ID
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in fetching single doctor info',
      error: error.message,
    });
  }
};

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController };
