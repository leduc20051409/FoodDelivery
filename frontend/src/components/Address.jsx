import React, { useEffect, useState } from 'react'
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import AddressCart from '../components/AddressCart';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../State/Customer/Orders/Action';
import { useNavigate } from 'react-router-dom';
import { addAddress, deleteAddress, getAddresses, updateAddress } from '../State/Customer/Addresses/Action ';

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

const Address = () => {
  const initialValue = {
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

  const [open, setOpen] = useState(false);
  const jwt = localStorage.getItem("token");
  const { auth, cart, addresses } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpenAddAddressModal = () => {
    setOpen(true);
  };

  const createOrderUsingAddress = (address) => {
    dispatch({ type: 'SET_SELECTED_ADDRESS', payload: address });
    navigate('/cart/checkout');
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

  useEffect(() => {
    dispatch(getAddresses(jwt));
    console.log('auth', auth);
    console.log('addresses', addresses);
  }, []);

  return (
    <>
      <main className="flex justify-center px-5 pb-10">
        <div>
          <h1 className="text-center font-semibold text-2xl py-10">
            Your Addresses
          </h1>
          <div className="flex gap-5 flex-wrap justify-center">
            {addresses.addresses.map((item) => (
              <AddressCart
                key={item.id}
                navigateToCheckOut={() => navigate('/cart/checkout')}
                handleSelectAddress={createOrderUsingAddress}
                item={item}
                showButton={true}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
              />
            ))}
            <Card className="flex gap-5 w-64 p-5">
              <AddLocationAltIcon />
              <div className="space-y-3 text-gray-500">
                <h1 className="font-semibold text-lg text-white">Add New Address</h1>
                <Button variant='outlined' fullWidth onClick={handleOpenAddAddressModal}>
                  Add
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Formik
            initialValues={initialValue}
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
                    label="State"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("state")}
                    helperText={
                      <ErrorMessage name="state">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="city"
                    label="City"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("city")}
                    helperText={
                      <ErrorMessage name="city">
                        {(msg) => <span className='text-red-600'>{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item size={{ xs: 12 }}>
                  <Field
                    as={TextField}
                    name="postalCode"
                    label="Postal Code"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("postalCode")}
                    helperText={
                      <ErrorMessage name="postalCode">
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
                <Button fullWidth variant="contained" type="submit" color='primary'>
                  Add Address
                </Button>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </>
  )
}

export default Address