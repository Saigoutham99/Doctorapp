import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import '../styles/RegisterStyles.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.post("http://localhost:8080/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());

      if (res.data.success) {
        // Save token in localStorage
        localStorage.setItem('token', res.data.token);

        setStatusMessage({ text: res.data.message, type: 'success' });
        message.success(res.data.message || 'Login Successful!');

        // Redirect to home after login
        setTimeout(() => navigate('/'), 1500);
      } else {
        setStatusMessage({ text: res.data.message, type: 'error' });
        message.error(res.data.message || 'Login failed.');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMsg = error.response?.data?.message || 'Something went wrong';
      setStatusMessage({ text: errorMsg, type: 'error' });
      message.error(errorMsg);
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
        <h3 className="text-center">Login Form</h3>

        {statusMessage.text && (
          <div className={`status-box ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>

        <Link to="/register">Don't have an account? Register Here</Link>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
