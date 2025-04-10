import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/getUserData',
        {},
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
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log('ProtectedRoute Error:', error);
      localStorage.removeItem('token');
      return <Navigate to="/login" />;
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem('token')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;