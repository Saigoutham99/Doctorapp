import React, { useState } from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import {useDispatch} from 'react-redux';
import {showLoading,hideLoading} from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterStyles.css"; // Keep styling the same

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post("http://localhost:8080/api/v1/user/register", values);
      dispatch(hideLoading())

      if (res.data.success) {
        setStatusMessage({ text: res.data.message, type: "success" });
        message.success(res.data.message || "Registered Successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatusMessage({ text: res.data.message, type: "error" });
        message.error(res.data.message || "Registration failed.");
      }
    } catch (error) {
      dispatch(hideLoading())
      const errorMsg = error.response?.data?.message || "Something went wrong";
      setStatusMessage({ text: errorMsg, type: "error" });
      message.error(errorMsg);
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
        <h3 className="text-center">Register Form</h3>

        {/* Status Message Box (Doesn't Change Layout) */}
        {statusMessage.text && (
          <div className={`status-box ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <Form.Item label="Name" name="name">
          <Input type="text" required />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>

        <Link to="/login" className="m-1">Already have an account?</Link>
        <button className="btn btn-primary" type="submit">Register</button>
      </Form>
    </div>
  );
};

export default Register;
