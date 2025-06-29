import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { forgotPassword } from '../../State/Customer/Authentication/Action'
const ForgotPasswordForm = () => {
    const initialValues = {
        email: "",
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        //e.preventDefault();
        dispatch(forgotPassword({ email: e.email }));
    }
    return (
        <>
            <Typography variant='h5' className='text-center'>
                Forgot Password
            </Typography>

            <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                <Form>
                    <Field
                        as={TextField}
                        name="email"
                        label="Email Address"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />

                    <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type='submit' variant='contained'>Submit</Button>

                </Form>
            </Formik>
            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                <span onClick={() => navigate("/account/login")} className='text-pink-600 cursor-pointer'>Go to Login</span>
            </Typography>
        </>
    )
}

export default ForgotPasswordForm
