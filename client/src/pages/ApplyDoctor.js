import React from 'react';
import Layout from '../components/Layout';
import { Col, Form, Input, Row, TimePicker, message, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      // Ensure timings are properly formatted as HH:mm
      const formattedTimings = [
        values.timings[0] ? values.timings[0].format("HH:mm") : '',
        values.timings[1] ? values.timings[1].format("HH:mm") : '',
      ];

      console.log('Formatted Timings:', formattedTimings);  // Log to check the timings before sending

      const res = await axios.post(
        '/api/v1/user/apply-doctor',
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
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <Layout>
      <h1 className='text-center'>Apply Doctor</h1>
      <Form layout='vertical' onFinish={handleFinish} className='m-3'>
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
            <Form.Item label='Timings' name='timings' required>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}></Col>
          <Col xs={24} md={24} lg={8}>
            <Button type="primary" htmlType="submit" className='form-btn'>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
