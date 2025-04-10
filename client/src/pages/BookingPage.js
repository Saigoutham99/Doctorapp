import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const BookingPage = () => {
  const { user } = useSelector(state => state.user);
  const params = useParams();
  const [doctors, setDoctor] = useState({});
  const [error, setError] = useState("");
  const [date, setDate] = useState(null);  
  const [time, setTime] = useState(null); 
  const [isAvailable, setAvailable] = useState();
  const dispatch = useDispatch();

  // Fetch doctor data based on doctorId
  const getDoctorData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorById', 
        { doctorId: params.doctorId },  
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data);
      } else {
        console.error("API Response Error:", res.data.message);
        setError(res.data.message || "Unauthorized access");
      }
    } catch (error) {
      console.error("Request Failed:", error.response?.data || error.message);
      setError("Authentication failed. Please log in again.");
    }
  };

  //****** booking func */
  const handleBooking = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,  // Fixed issue here
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          }
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }

    } catch (error) {
      dispatch(hideLoading());
      console.log(error); 
    }
  };

  useEffect(() => {
    getDoctorData();  // Call API on component mount
  }, []);

  return (
    <Layout>
      <h1>Booking Page</h1>
      <div className="container">
        {doctors && (
          <div>
            <h4>Dr. {doctors.firstName} {doctors.lastName}</h4>
            <h4>Fees: {doctors.feesPerConsultation}</h4>
            <h4>Timings: {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}</h4>
            <div className="d-flex flex-column w-50">
              {/* Use 'month' picker for better month/year navigation */}
              <DatePicker
                className="m-2" 
                format="DD-MM-YYYY"
                picker="date"  // This should allow you to see month and year
                onChange={(value) => setDate(moment(value).format("DD-MM-YYYY"))} 
              />
              <TimePicker 
                format="HH:mm"  
                className="m-2"  
                onChange={(value) => setTime(moment(value).format("HH:mm"))} 
              />
              <button className="btn btn-primary mt-2">
                Check Availability
              </button>
              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </Layout>
  );
};

export default BookingPage;
