import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logo } from '../assets/logo'
import CartTotals from '../components/Order/CartTotals'
import { Button, TextField, Paper, Box, Typography, Radio, Divider } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../State/Customer/Orders/Action'
import Title from '../components/Title'

const CheckoutPage = () => {
  const { auth, cart, order } = useSelector(store => store);
  const [method, setMethod] = useState("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("auth", auth);
    console.log("cart", cart);
  }, [auth]);

  useEffect(() => {
    if (order.currentOrder && method === 'CASH_ON_DELIVERY') {
      // Navigate to success page for COD orders
      navigate('/my-profile/orders', { state: { order: order.currentOrder } });
    }
  }, [order.currentOrder, method, navigate]);

  const placeOrder = () => {
    setLoading(true);
    try {
      const orderData = {
        restaurantId: cart.cartItems[0].food.restaurant.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: auth.selectedAddress?.streetAddress,
          city: auth.selectedAddress?.city,
          stateProvince: auth.selectedAddress?.stateProvince,
          postalCode: auth.selectedAddress?.postalCode,
          country: auth.selectedAddress?.country,
          phoneNumber: auth.selectedAddress?.phoneNumber,
        },
        paymentMethod: method,
        paymentTransactionId: null,
      };

      const reqData = {
        order: orderData,
        token: localStorage.getItem("token"),
        navigate: navigate
      };
      dispatch(createOrder(reqData));
      console.log("Order Data: ", orderData);
    } catch (error) {
      console.error("Order placement error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (order.loading || loading) {
    return (
      <Box className='container mx-auto px-4 py-8 text-center'>
        <Typography variant="h6">Processing your order...</Typography>
      </Box>
    );
  }

  if (order.error) {
    return (
      <Box className='container mx-auto px-4 py-8 text-center'>
        <Typography variant="h6" color="error">
          Error: {order.error.message || 'Something went wrong'}
        </Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box className='container mx-auto px-4 py-8'>
      <div className='flex flex-col lg:flex-row justify-between gap-8'>
        {/* Left side - Delivery Information */}
        <Paper elevation={3} className="flex-1 p-6 max-w-2xl" sx={{ fontSize: '1.5rem' }}>
          <Box className="mb-6">
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </Box>

          <Box component="form" className="space-y-4">
            <TextField
              fullWidth
              label="Full Name"
              value={auth.user?.fullName || ''}
              variant="outlined"
              size="small"
              required
              sx={{ mb: 2 }}
            />


            <TextField
              fullWidth
              label="Email Address"
              value={auth.user?.email || ''}
              variant="outlined"
              type="email"
              size="small"
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Street Address"
              value={auth.selectedAddress?.streetAddress || ''}
              variant="outlined"
              size="small"
              required
              sx={{ mb: 2 }}
              multiline
              rows={2}
            />

            <div className="flex gap-4">
              <TextField
                fullWidth
                label="City"
                value={auth.selectedAddress?.city || ''}
                variant="outlined"
                size="small"
                required
              />
              <TextField
                fullWidth
                label="State"
                value={auth.selectedAddress?.stateProvince || ''}
                variant="outlined"
                size="small"
                required
              />
            </div>

            <div className="flex gap-4">
              <TextField
                fullWidth
                label="Zip Code"
                value={auth.selectedAddress?.postalCode || ''}
                variant="outlined"
                size="small"
                required
              />
              <TextField
                fullWidth
                label="Country"
                value={auth.selectedAddress?.country || ''}
                variant="outlined"
                size="small"
                required
              />
            </div>

            <TextField
              fullWidth
              label="Phone Number"
              value={auth.selectedAddress?.phoneNumber || ''}
              variant="outlined"
              type="tel"
              size="small"
              required
            />
          </Box>
        </Paper>

        {/* Right side - Payment and Order Summary */}
        <Paper elevation={3} className="flex-1 p-6 max-w-md">
          <Box className="mb-8">
            <CartTotals item={cart.cart} />
          </Box>

          <Divider className="my-6" />

          <Box className="mb-6">
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </Box>

          {/* Payment Method Selection */}
          <Box className="space-y-3">
            <Paper
              onClick={() => setMethod("STRIPE_PAY")}
              elevation={method === 'STRIPE_PAY' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'STRIPE_PAY' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'STRIPE_PAY'}
                  size="small"
                />
                <img className="h-6" src={logo.stripe_logo} alt="STRIPE_PAY" />
              </div>
            </Paper>

            <Paper
              onClick={() => setMethod("VN_PAY")}
              elevation={method === 'VN_PAY' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'VN_PAY' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'VN_PAY'}
                  size="small"
                />
                <img className="h-6" src={logo.vnPay_logo} alt="VN_PAY" />
              </div>
            </Paper>

            <Paper
              onClick={() => setMethod("CASH_ON_DELIVERY")}
              elevation={method === 'CASH_ON_DELIVERY' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'CASH_ON_DELIVERY' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'CASH_ON_DELIVERY'}
                  size="small"
                />
                <Typography variant="body2" className="font-medium">
                  CASH ON DELIVERY
                </Typography>
              </div>
            </Paper>
          </Box>

          <Button
            variant='contained'
            fullWidth
            size="large"
            onClick={placeOrder}
            disabled={loading || order.loading}
            sx={{
              mt: 4,
              py: 1.5,
              backgroundColor: '#e91e63',
              '&:hover': {
                backgroundColor: '#c2185b',
              }
            }}
          >
            {loading || order.loading ? 'Processing...' : 'Place Order'}
          </Button>
        </Paper>
      </div>
    </Box>
  )
}

export default CheckoutPage
