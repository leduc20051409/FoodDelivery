// ResetPasswordSuccess.js
import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Button, Typography, Container } from '@mui/material';
import { logo } from '../../assets/logo';

const ResetPasswordSuccess = ({ onReturnToSignIn }) => {
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
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <img
            src={logo.dinner_logo}
            alt="Website Logo"
            style={{ maxWidth: '150px', height: 'auto' }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1 }}
        >
          Reset password successful
        </Typography>
      </Box>

      <Box
        sx={{
          bgcolor: '#151b23',
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: 'text.primary', mb: 2 }}
        >
          Your password has been reset successfully. You can now sign in with your new password.
        </Typography>

        <Button
          variant="contained"
          fullWidth
          onClick={onReturnToSignIn}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'bold',
            ':hover': {
              bgcolor: 'dark.primary.main',
            },
          }}
        >
          Return to sign in
        </Button>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Terms · Privacy · Docs · Contact GitHub Support
        </Typography>
      </Box>
    </Container>
  );
};

export default ResetPasswordSuccess;
