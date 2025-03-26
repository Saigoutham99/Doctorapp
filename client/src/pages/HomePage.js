import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  // Fetch user data
  const getUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      setError("No authentication token found. Please log in.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setUserData(res.data.data);
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
      <h1>Home Page</h1>

      {/* {error && <p style={{ color: "red" }}>{error}</p>}

      {userData ? (
        <div>
          <h2>Welcome, {userData.name}</h2>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        !error && <p>Loading user data...</p>
      )} */}
    </Layout>
  );
};

export default HomePage;
