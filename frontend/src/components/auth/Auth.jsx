import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Modal } from '@mui/material'
import { style } from '../../pages/Cart';
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import ForgotPasswordForm from './ForgotPasswordForm'

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const getForm = () => {
        switch (location.pathname) {
            case "/account/register":
                return <RegisterForm />;
            case "/account/forgot-password":
                return <ForgotPasswordForm />;
            default:
                return <LoginForm />;
        }
    }

    return (
        <>
            <Modal 
                onClose={() => navigate("/")} 
                open={
                    location.pathname === "/account/register" ||
                    location.pathname === "/account/login" ||
                    location.pathname === "/account/forgot-password"
                }
            >
                <Box sx={style}>
                    {getForm()}
                </Box>
            </Modal>
        </>
    )
}

export default Auth
