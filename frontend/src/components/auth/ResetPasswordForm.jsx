import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ResetPasswordSuccess from './ResetPasswordSuccess';
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { logo } from '../../assets/logo';
import { resetPassword } from '../../State/Customer/Authentication/Action';

const ResetPasswordForm = () => {
  const { auth } = useSelector((store) => store);
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[0-9])/,
        'Password must include at least one number and one lowercase letter'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/auth/verify-reset-token/${token}`);
        const data = await response.json();

        if (response.ok && data.email) {
          setEmail(data.email);
        } else {
          setError(data.message || 'Invalid or expired token');
        }
      } catch (error) {
        setError('Failed to verify token');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = (values) => {
    dispatch(resetPassword({ token: token, newPassword: values.password }));
    console.log('Password changed for user:', email , 'New Password:', values.password);
    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  const handleReturnToSignIn = () => {
    navigate('/account/login');
  };

  if (loading) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Verifying token...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/account/login')}>
            Return to Sign In
          </Button>
        </Box>
      </Container>
    );
  }

  if (success) {
    return <ResetPasswordSuccess onReturnToSignIn={handleReturnToSignIn} />;
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', }}>
          <img
            src={logo.website_logo}
            alt="Website Logo"
            style={{ maxWidth: '150px', height: 'auto' }}
          />
        </Box>


        <Typography
          variant="h6"
          sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1 }}
        >
          Change password for @{email}
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Box
            sx={{
              bgcolor: '#151b23',
              p: 3,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            <Field
              as={TextField}
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: 'text.secondary' } }}
              aria-label="Enter new password"
            />
            <ErrorMessage
              name="password"
              component="div"
              style={{
                color: '#d32f2f', // theme.error.main
                fontSize: '12px',
                marginTop: '4px',
              }}
            />

            <Field
              as={TextField}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: 'text.secondary' } }}
              aria-label="Confirm new password"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              style={{
                color: '#d32f2f',
                fontSize: '12px',
                marginTop: '4px',
              }}
            />

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 2, mb: 2 }}
            >
              Make sure it's at least 15 characters OR at least 8 characters
              including a number and a lowercase letter.
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: 'primary.main', // green like GitHub button
                color: 'white',
                textTransform: 'none',
                fontWeight: 'bold',
                ':hover': {
                  bgcolor: 'dark.primary.main',
                },
              }}
              aria-label="Change password"
            >
              Change password
            </Button>
          </Box>
        </Form>
      </Formik>

      {/* Optional footer below */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Terms · Privacy · Docs · Contact GitHub Support
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
