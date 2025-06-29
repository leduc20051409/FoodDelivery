// MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar';

const MainLayout = () => (
  <>
    <NavBar />
    <Outlet />
  </>
);

export default MainLayout;

