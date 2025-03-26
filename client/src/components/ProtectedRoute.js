import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';


const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Function to get user data from backend
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/getUserData',
        {}, // No need to send token in body; it's already in headers
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
        localStorage.clear();
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log('ProtectedRoute Error:', error);
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
      localStorage.clear();
    }
  };

  // This ensures we call getUser once, not on every render
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  // If token exists, render the child routes, else navigate to login
  if (localStorage.getItem('token')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
