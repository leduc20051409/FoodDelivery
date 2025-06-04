import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../State/Customer/Authentication/Action'
const LoginForm = () => {
    const initialValues = {
        email: "",
        password: "",
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (values) => {
        dispatch(loginUser({ userData: values, navigate }));
    }
    return (
        <>
            <Typography variant='h5' className='text-center'>
                Login
            </Typography>

            <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                <Form>
                    <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />

                    <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type='submit' variant='contained'>Login</Button>

                </Form>
            </Formik>
            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                Don't have an account?
                <span onClick={() => navigate("/account/register")} className='text-pink-600 cursor-pointer'>Register</span>
            </Typography>

             <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                <span onClick={() => navigate("/account/forgot-password")}  className='text-pink-700 cursor-pointer hover:underline'>Forgot Password</span>
            </Typography>
        </>
    )
}

export default LoginForm
