import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert
} from '@mui/material';
import { Cancel, ShoppingCart, Home } from '@mui/icons-material';

const PaymentCancel = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Payment cancelled for session:', sessionId);
  }, [sessionId]);

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  return (
    <Box 
      className="min-h-screen flex items-center justify-center"
    >
      <Paper elevation={3} className="p-8 text-center max-w-lg w-full mx-4">
        <Cancel 
          sx={{ 
            fontSize: 80, 
            color: 'warning.main', 
            mb: 2 
          }} 
        />
        
        <Typography variant="h4" className="mb-2 font-bold text-orange-600">
          Payment Cancelled
        </Typography>
        
        <Typography variant="body1" className="mb-4 text-gray-600">
          Your payment was cancelled. No charges have been made to your account.
        </Typography>

        <Alert severity="info" className="mb-6">
          Your order has not been placed. Your cart items are still saved.
        </Alert>

        <Typography variant="body2" className="mb-6 text-gray-500">
          You can return to your cart to review your items or continue shopping.
        </Typography>

        <Box className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outlined" 
            onClick={handleContinueShopping}
            startIcon={<Home />}
            size="large"
          >
            Continue Shopping
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleReturnToCart}
            startIcon={<ShoppingCart />}
            size="large"
          >
            Return to Cart
          </Button>
          
          <Button 
            variant="contained" 
            onClick={handleRetryPayment}
            size="large"
            sx={{ 
              backgroundColor: '#e91e63',
              '&:hover': { backgroundColor: '#c2185b' }
            }}
          >
            Try Again
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentCancel;