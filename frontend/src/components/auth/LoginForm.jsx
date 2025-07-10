import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, TextField, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, loginWithGoogle } from '../../State/Customer/Authentication/Action';
import GoogleIcon from '@mui/icons-material/Google'; 
import FacebookIcon from '@mui/icons-material/Facebook'; 
import { styled } from '@mui/material/styles';



const OAuthButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  backgroundColor: '#fff',
  color: '#000',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const LoginForm = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

 

  const handleSubmit = (values) => {
    dispatch(loginUser({ userData: values, navigate }));
  };

 
  const handleOAuthLogin = (provider) => {
    if (provider === 'google') {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!googleClientId) {
        console.error('Google Client ID is not configured');
        return;
      }

      const redirectUri = 'http://localhost:5173/login/oauth2/code/google';
      const scope = 'openid profile email';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=select_account`;

      console.log('Redirecting to Google OAuth...');
      window.location.href = googleAuthUrl;
    } else {
      console.log(`Logging in with ${provider}...`);
    }
  };

  return (
    <>
      <Typography variant="h5" className="text-center">
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
            type="password"
          />
          <Button sx={{ mt: 2, padding: '1rem' }} fullWidth type="submit" variant="contained">
            Login
          </Button>
        </Form>
      </Formik>

      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don't have an account?
        <span
          onClick={() => navigate('/account/register')}
          className="text-pink-600 cursor-pointer"
        >
          Register
        </span>
      </Typography>

      <Typography variant="body2" align="center" sx={{ mt: 1 }}>
        <span
          onClick={() => navigate('/account/forgot-password')}
          className="text-pink-700 cursor-pointer hover:underline"
        >
          Forgot Password
        </span>
      </Typography>

      <Divider sx={{ my: 3 }}>OR</Divider>

      <div>
        <OAuthButton
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => handleOAuthLogin('google')}
        >
          Continue with Google
        </OAuthButton>
      </div>
    </>
  );
};

export default LoginForm;