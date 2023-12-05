import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';

const AdminRoute = ({ path, element }) => {
  const navigate = useNavigate();
  const { userCurrent } = useContext(AppContext);
  const role = userCurrent?.role ?? 'user';

  useEffect(() => {
    if (role !== 'admin') {
      console.log('vào redirect');
      navigate('/');
    }
  }, [userCurrent]);

  return <Outlet />;
};

export default AdminRoute;