import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../Title'
import { logo } from '../../assets/logo'
import CartTotals from './CartTotals'
import { Button, TextField, Paper, Box, Typography, Radio, Divider } from '@mui/material'
import { useSelector } from 'react-redux'

const CheckoutPage = () => {
  const { auth, cart } = useSelector(store => store);
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("auth", auth);
    console.log("cart", cart);
  }, [auth]);

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
            <CartTotals item={cart.cart}/>
          </Box>

          <Divider className="my-6" />

          <Box className="mb-6">
            <Title text1={'PAYMENT'} text2={'METHOD'} />
          </Box>

          {/* Payment Method Selection */}
          <Box className="space-y-3">
            <Paper
              onClick={() => setMethod("stripe")}
              elevation={method === 'stripe' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'stripe' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'stripe'}
                  size="small"
                />
                <img className="h-6" src={logo.stripe_logo} alt="Stripe" />
              </div>
            </Paper>

            <Paper
              onClick={() => setMethod("Razorpay")}
              elevation={method === 'Razorpay' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'Razorpay' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'Razorpay'}
                  size="small"
                />
                <img className="h-6" src={logo.razorpay_logo} alt="Razorpay" />
              </div>
            </Paper>

            <Paper
              onClick={() => setMethod("cod")}
              elevation={method === 'cod' ? 2 : 0}
              className={`p-4 cursor-pointer transition-all ${method === 'cod' ? 'border-2 border-green-500' : 'border'}`}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={method === 'cod'}
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
            onClick={() => navigate("/order/confirm")}
            sx={{
              mt: 4,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Place Order
          </Button>
        </Paper>
      </div>
    </Box>
  )
}

export default CheckoutPage
