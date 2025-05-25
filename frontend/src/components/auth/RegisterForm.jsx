import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, FormControl, TextField, Typography, Select, MenuItem, InputLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from '../State/Authentication/Action'

const RegisterForm = () => {
    const initialValues = {
        fullName: "",
        email: "",
        password: "",
        role: "ROLE_CUSTOMER",
    }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (values) => {
        dispatch(registerUser({ userData: values, navigate }));
    }
    return (
        <>
            <Typography variant='h5' className='text-center'>
                Register
            </Typography>

            <Formik onSubmit={handleSubmit} initialValues={initialValues}>
                <Form>
                    <Field
                        as={TextField}
                        name="fullName"
                        label="fullName"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
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
                        type="password"
                    />

                    <Field
                        fullWidth
                        margin="normal"
                        as={Select}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={role}
                        name="role"
                        defaultValue={"ROLE_CUSTOMER"}
                    // onChange={handleChange}
                    >
                        <MenuItem value={'ROLE_CUSTOMER'}>Customer</MenuItem>
                        <MenuItem value={'ROLE_RESTAURANT_OWNER'}>Restaurant Owner</MenuItem>

                    </Field>


                    <Button sx={{ mt: 2, padding: "1rem" }} fullWidth type='submit' variant='contained'>Register</Button>

                </Form>
            </Formik>
            <Typography variant='body2' align='center' sx={{ mt: 3 }}>
                If you have an account?
                <span onClick={() => navigate("/account/login")} className='text-pink-600 cursor-pointer'>Login</span>
            </Typography>
        </>
    )
}

export default RegisterForm
