import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Modal } from '@mui/material'
import { style } from '../../pages/Cart';
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <>
            <Modal onClose={() => navigate("/")} open={
                location.pathname === "/account/register" ||
                location.pathname === "/account/login"
            }>
                <Box sx={style}>
                    {location.pathname === "/account/register" ? <RegisterForm /> : <LoginForm />}
                </Box>
            </Modal>

        </>
    )
}

export default Auth
