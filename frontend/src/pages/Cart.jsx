import React, { useEffect, useState } from 'react'
import CartItem from '../components/CartItem'
import { Alert, Box, Button, Card, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Snackbar, TextField, Typography } from '@mui/material'
import AddressCart from '../components/AddressCart';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../State/Customer/Orders/Action';
import { useNavigate } from 'react-router-dom';
import { addAddress, deleteAddress, getAddresses, updateAddress } from '../State/Customer/Addresses/Action ';
import { clearCartAction } from '../State/Customer/Cart/Action';
import { isSameRestaurant } from '../components/config/Logic';

export const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: 'none',
  boxShadow: 24,
  p: 4,
};

const Cart = () => {
  const demo = [1, 1, 1, 1];
  const [open, setOpen] = useState(false);
  const jwt = localStorage.getItem("token");
  const { auth, cart, addresses } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'error' });

  const showMessage = (message, severity = 'error') => {
    setSnack({ open: true, message, severity })
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSnack((prev) => ({ ...prev, open: false }))
  }

  const intitalValue = {
    streetAddress: '',
    state: '',
    postalCode: '',
    city: '',
    country: '',
    phoneNumber: '',
  }
  const validateSchema = Yup.object().shape({
    streetAddress: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    postalCode: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
  });


  const handleClose = () => setOpen(false);
  const handleOpenAddAddressModal = () => {
    setOpen(true);
  };
  const createOrderUsingAddress = (address) => {
    if (!isSameRestaurant(cart.cartItems)) {
      showMessage('All items in the cart must be from the same restaurant to proceed with the order.', 'error');
      return;
    } else {
      dispatch({ type: 'SET_SELECTED_ADDRESS', payload: address });
      navigate('/cart/checkout');
    }
  }
  const handleSubmit = (values) => {
    const data = {
      token: localStorage.getItem("token"),
      order: {
        restaurantId: cart.cartItems[0].food.restaurant.id,
        deliveryAddress: {
          // fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          stateProvince: values.state,
          postalCode: values.pincode,
          country: values.country,
        }
      }
    }
    dispatch(createOrder(data));
  }

  const handleAddAddress = (values) => {
    const addressData = {
      streetAddress: values.streetAddress,
      city: values.city,
      stateProvince: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phoneNumber: values.phoneNumber
    };
    dispatch(addAddress(addressData, jwt));
    console.log('Adding address:', addressData);
    handleClose();
  }

  const handleEditAddress = (address) => {
    dispatch(updateAddress(address.id, address, jwt));
  };

  const handleDeleteAddress = (address) => {
    dispatch(deleteAddress(address.id, jwt));
    console.log('Deleting address:', address);
  };

  const handleClearCart = () => {
    dispatch(clearCartAction());
  };

  useEffect(() => {
    dispatch(getAddresses(jwt));
    console.log('auth', auth);
    console.log('addresses', addresses);
  }, []);

  if (!cart?.cart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Typography variant="h6">Loading cart...</Typography>
      </div>
    );
  }

  return (
    <>
      <main className="lg:flex justify-between">
        <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
          {cart.cartItems.length === 0 ? (
            <Typography className="p-10 text-center text-gray-500">
              Your cart is empty. Please add items to your cart.
            </Typography>
          ) : (
            <>
              <div className="px-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {cart.cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <Divider className="my-4" />
              <div className="billlDetails px-5 text-sm">
                <p className="font-extralight py-5">Bill Details</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <p>Item Total</p>
                    <p>${cart.cart.total}</p>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <p>Delivey Fee</p>
                    <p>$21</p>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <p>GST and Reataurant Charges</p>
                    <p>$33</p>
                  </div>
                  <Divider />
                </div>
                <div className="flex justify-between text-gray-400 ">
                  <p>Total pay</p>
                  <Divider orientation="vertical" />
                  <p className="font-bold text-red-500 text-lg">${cart.cart.total + 54}</p>
                </div>
              </div>
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>

            </>
          )}
        </section>
        <Divider orientation="vertical" flexItem />
        <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
          <div>
            <h1 className="text-center font-semibold text-2xl py-10">
              Choose Delivery Address
            </h1>
            <div className="flex gap-5 flex-wrap justify-center">
              {addresses.addresses.map((item) => (
                <AddressCart
                  handleSelectAddress={createOrderUsingAddress}
                  item={item}
                  showButton={true}
                  handleEditAddress={handleEditAddress}
                  handleDeleteAddress={handleDeleteAddress} />
              ))}
              <Card className="flex gap-5 w-64 p-5">
                <AddLocationAltIcon />
                <div className="space-y-3 text-gray-500">
                  <h1 className="font-semibold text-lg text-white">Add New Address</h1>

                  <Button variant='outlined' fullWidth onClick={handleOpenAddAddressModal}>Add</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-zinc-900">
          <Formik
            initialValues={intitalValue}
            validationSchema={validateSchema}
            onSubmit={handleAddAddress}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="streetAddress"
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />

                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="state"
                    label="state"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />

                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="city"
                    label="city"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />

                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="postalCode"
                    label="postalCode"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("phoneNumber")}
                    helperText={
                      <ErrorMessage name="phoneNumber">
                        {msg => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>}
                    placeholder="e.g. +84 123 456 789" />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="country-label">Country</InputLabel>
                    <Field
                      as={Select}
                      labelId="country-label"
                      id="country"
                      name="country"
                      label="Country"
                    >
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="Canada">Canada</MenuItem>
                      <MenuItem value="Vietnam">Vietnam</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item size={{ xs: 12 }}>
                <Button fullWidth variant="contained" type="submit" color='primary'>Add Address</Button>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal >
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Cart
