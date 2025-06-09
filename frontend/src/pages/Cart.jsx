import React, { useState } from 'react'
import CartItem from '../components/CartItem'
import { Box, Button, Card, Divider, Grid, Modal, TextField, Typography } from '@mui/material'
import AddressCart from '../components/AddressCart';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../State/Customer/Orders/Action';

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
  const intitalValue = {
    streetAddress: '',
    state: '',
    pincode: '',
    city: '',
  }
  const validateSchema = Yup.object().shape({
    streetAddress: Yup.string().required('Required'),
    state: Yup.string().required('Required'),
    pincode: Yup.string().required('Required'),
    city: Yup.string().required('Required'),
  });
  const [open, setOpen] = useState(false);
  const { auth, cart } = useSelector(store => store);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);
  const handleOpenAddAddressModal = () => {
    setOpen(true);
  };
  const createOrderUsingAddress = () => {
    console.log('clicked');
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
          {cart?.cartItems.map((item) => <CartItem item={item} />)}
          <Divider />
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
        </section>
        <Divider orientation="vertical" flexItem />
        <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
          <div>
            <h1 className="text-center font-semibold text-2xl py-10">
              Choose Delivery Address
            </h1>
            <div className="flex gap-5 flex-wrap justify-center">
              {demo.map((item) => (
                <AddressCart handleSelectAddress={createOrderUsingAddress} item={item} showButton={true} />
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
        <Box sx={style}>
          <Formik
            initialValues={intitalValue}
            validationSchema={validateSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="pincode"
                    label="pincode"
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
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" type="submit" color='primary'>Delivery Here</Button>
                </Grid>
              </Grid>
            </Form>

          </Formik>
        </Box>
      </Modal>
    </>
  )
}

export default Cart
