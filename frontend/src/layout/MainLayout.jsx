import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

export default MainLayout;

