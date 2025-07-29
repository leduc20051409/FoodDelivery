import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { PaymentService } from '../../services/PaymentService';
import { getUsersOrders } from '../../State/Customer/Orders/Action';
import { clearCartAction } from '../../State/Customer/Cart/Action';


const PaymentSuccess = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);

    const [loading, setLoading] = useState(true);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [error, setError] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const jwt = localStorage.getItem('token');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                setLoading(true);
                // Extract session ID from URL if not in params
                const extractedSessionId = sessionId || PaymentService.extractSessionIdFromUrl();

                console.log('Session ID:', extractedSessionId);
                if (!extractedSessionId) {
                    setError('Payment session ID not found');
                    return;
                }
                // Verify payment with backend
                const verificationResult = await PaymentService.verifyPayment(extractedSessionId, jwt);

                if (verificationResult.verified) {
                    setPaymentVerified(true);
                    setOrderDetails(verificationResult.order);
                    // Refresh user orders
                    if (jwt) {
                        dispatch(getUsersOrders(jwt));
                    }
                    dispatch(clearCartAction());
                } else {
                    setError('Payment verification failed');
                }
            } catch (err) {
                console.error('Payment verification error:', err);
                setError(err.message || 'Payment verification failed');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId, dispatch, jwt]);

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/my-profile/orders');
    };

    if (loading) {
        return (
            <Box
                className="min-h-screen flex items-center justify-center"
                //sx={{ backgroundColor: '#f5f5f5' }}
            >
                <Paper elevation={3} className="p-8 text-center max-w-md w-full mx-4">
                    <CircularProgress size={60} color="success" />
                    <Typography variant="h6" className="mt-4">
                        Verifying your payment...
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                className="min-h-screen flex items-center justify-center"
            >
                <Paper elevation={3} className="p-8 text-center max-w-md w-full mx-4">
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/cart')}
                        sx={{ mt: 2 }}
                    >
                        Return to Cart
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box
            className="min-h-screen flex items-center justify-center"
        >
            <Paper elevation={3} className="p-8 text-center max-w-lg w-full mx-4">
                <CheckCircle
                    sx={{
                        fontSize: 80,
                        color: 'success.main',
                        mb: 2
                    }}
                />

                <Typography variant="h4" className="mb-2 font-bold text-green-400">
                    Payment Successful!
                </Typography>

                <Typography variant="body1" className="mb-4 text-gray-400">
                    Thank you for your order. Your payment has been processed successfully.
                </Typography>

                {orderDetails && (
                    <Box className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Typography variant="h6" className="mb-2">
                            Order Details
                        </Typography>
                        <Typography variant="body2">
                            Order ID: #{orderDetails.id}
                        </Typography>
                        <Typography variant="body2">
                            Amount: ${(orderDetails.totalPrice / 100).toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                            Restaurant: {orderDetails.restaurant?.name}
                        </Typography>
                    </Box>
                )}

                <Alert severity="info" className="mb-4">
                    You will receive an order confirmation email shortly.
                    You can track your order status in your profile.
                </Alert>

                <Box className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        variant="outlined"
                        onClick={handleContinueShopping}
                        size="large"
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleViewOrders}
                        size="large"
                        sx={{
                            backgroundColor: '#e91e63',
                            '&:hover': { backgroundColor: '#c2185b' }
                        }}
                    >
                        View My Orders
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentSuccess;