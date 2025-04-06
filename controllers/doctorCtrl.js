const doctorModel = require('../models/doctorModel');
const moment = require('moment');

// Get Doctor Info
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

// Update Doctor Profile
const updateProfileController = async (req, res) => {
  try {
    const { userId, timings, ...restFields } = req.body;

    // Log the request data
    console.log('Request Body:', req.body);

    // Ensure timings are correctly formatted
    if (timings && Array.isArray(timings) && timings.length === 2) {
      const formattedTimings = [
        moment(timings[0], "HH:mm").isValid() ? moment(timings[0], "HH:mm").format("HH:mm") : '',
        moment(timings[1], "HH:mm").isValid() ? moment(timings[1], "HH:mm").format("HH:mm") : '',
      ];

      console.log('Formatted Timings:', formattedTimings);  // Log formatted timings for debugging

      // Update the doctor profile with the provided fields
      const doctor = await doctorModel.findOneAndUpdate(
        { userId },
        { ...restFields, timings: formattedTimings },
        { new: true }  // Return the updated doctor object
      );

      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found", success: false });
      }

      res.status(200).json({
        success: true,
        message: "Doctor Profile Updated",
        data: doctor,  // Return the updated doctor data
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

//get single doctor
const getDoctorByIdController = async(req,res) =>{
  try {
    const doctor = await doctorModel.findOne({_id:req.body.doctorId})
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:'Error in Single doctor Info'
    })
    
  }
};

module.exports = { getDoctorInfoController, updateProfileController,getDoctorByIdController };
