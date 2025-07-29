import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

const MainLayout = () => (
  <>
    <NavBar />
    <div className="pt-16">
      <Outlet />
    </div>
  </>
);

export default MainLayout;

