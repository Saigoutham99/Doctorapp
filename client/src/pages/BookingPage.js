import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { DatePicker, TimePicker } from "antd";
import moment from "moment";

const BookingPage = () => {
  const params = useParams();
  const [doctors, setDoctor] = useState({});
  const [error, setError] = useState("");
  const [data,setDate] = useState()
  const [timings, setTimings] = useState()
  const [isAvailable, setAvailable] = useState()

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
        '/api/v1/doctor/getDoctorById', // Correct API route
        { doctorId: params.doctorId },  // doctorId from URL params
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Bearer token for authorization
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

  useEffect(() => {
    getDoctorData();  // Call API on component mount
  }, []);

  return (
    <Layout>
      <h1>Booking Page</h1>
      <div className="container">
        {doctors && (
          <div>
          <h4>
            Dr.{doctors.firstName} {doctors.lastName}
          </h4>
          <h4>Fees : {doctors.feesPerConsultation}</h4>
          <h4>
          Timings: {doctors.timings && doctors.timings[0]} - {doctors.timings && doctors.timings[1]}
          </h4>
          <div className="d-flex flex-column w-50">
            <DatePicker
            className="m-2" 
            format="DD-MM-YYYY"  onChange={(value) => moment(value).format("DD-MM-YYYY")}/>
            <TimePicker.RangePicker format="HH:mm"  className="m-2"  onChange={(values) => setTimings([
              moment(values[0]).format("HH:mm"),
              moment(values[1]).format("HH:mm"),
            ])}/>
            <button className="btn btn-primary mt-2">
              Check Availability
            </button>
          </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
