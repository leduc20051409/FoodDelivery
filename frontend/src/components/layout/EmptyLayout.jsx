// EmptyLayout.jsx
// Chỉ render con, không có NavBar
import React from 'react';
import { Outlet } from 'react-router-dom';

const EmptyLayout = () => <Outlet />;

export default EmptyLayout;
