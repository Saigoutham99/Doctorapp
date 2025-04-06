import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import moment from 'moment';

const Profile = () => {
  const { user } = useSelector((state) => state.user);  // Get logged-in user from Redux store
  const [doctor, setDoctor] = useState(null);  // State to store doctor's info
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();  // Extract user ID from URL

  // Get Doctor Information
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorInfo',
        { userId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        setDoctor(res.data.data);  // Set doctor info in state
      }
    } catch (error) {
      console.log("Error fetching doctor info:", error);  // Log any errors
    }
  };

  useEffect(() => {
    if (id) {
      getDoctorInfo();  // Fetch doctor info when the component mounts
    }
  }, [id]);

  // Update Doctor Profile
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      // Ensure timings are properly formatted as HH:mm
      const formattedTimings = [
        moment(values.timings[0]).isValid() ? moment(values.timings[0]).format("HH:mm") : '',
        moment(values.timings[1]).isValid() ? moment(values.timings[1]).format("HH:mm") : '',
      ];

      console.log('Formatted Timings:', formattedTimings);  // Log to check the timings before sending

      const res = await axios.post(
        '/api/v1/doctor/updateProfile',
        { 
          ...values, 
          userId: user.id,
          timings: formattedTimings,  // Sending formatted timings
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate('/');
      } else {
        message.error(res.data.message || 'Failed to apply');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong. Please try again later.');
    }
  };

  // Ensure doctor.timings is an array and has default values
  if (!doctor) return <p>Loading...</p>;  // Show loading text until data is fetched

  return (
    <Layout>
      <h1>Manage Profile</h1>
      {
        doctor && (
          <Form 
            layout='vertical' 
            onFinish={handleFinish} 
            className='m-3' 
            initialValues={{
              ...doctor,
              timings: doctor.timings && doctor.timings.length === 2
                ? [
                    moment(doctor.timings[0], 'HH:mm'),
                    moment(doctor.timings[1], 'HH:mm')
                  ]
                : [null, null]  // Default to null if timings are not available or invalid
            }}
          >
            <h6>Personal Details:</h6>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='First Name' name='firstName' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your First Name' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Last Name' name='lastName' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Last Name' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Phone No' name='phone' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Contact Number' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Email' name='email' required rules={[{ required: true }]}>
                  <Input type='email' placeholder='Your Email ID' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Website' name='website' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Website (if applicable)' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Address' name='address' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Address' />
                </Form.Item>
              </Col>
            </Row>

            <h6>Professional Details:</h6>
            <Row gutter={20}>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Specialization' name='specialization' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Specialization' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Experience' name='experience' required rules={[{ required: true }]}>
                  <Input type='text' placeholder='Your Experience (in years)' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Fees Per Consultation' name='feesPerConsultation' required rules={[{ required: true }]}>
                  <Input type='number' placeholder='Your Fees' />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item label='Timings' name='timings' required rules={[{ required: true }]}>
                  <TimePicker.RangePicker 
                    format="HH:mm" 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}></Col>
              <Col xs={24} md={24} lg={8}>
                <button className='btn btn-primary form-btn' type='submit'>Update</button>
              </Col>
            </Row>
          </Form>
        )
      }
    </Layout>
  );
};

export default Profile;
