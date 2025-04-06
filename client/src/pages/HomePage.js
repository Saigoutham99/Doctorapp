import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [doctors, setDoctors] = useState([])

  // Fetch user data
  const getUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/user/getAllDoctors",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setDoctors(res.data.data);
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
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>
      <Row>
        {doctors && doctors.map((doctor) => <DoctorList doctor ={doctor} />)}
      </Row>
    </Layout>
  );
};

export default HomePage;
