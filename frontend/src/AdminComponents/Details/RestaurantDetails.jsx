import React, { use } from 'react'
import Button from '@mui/material/Button'
import { Card, CardContent, CardHeader, Grid, Paper, styled } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useDispatch, useSelector } from 'react-redux';
import { updateRestaurantStatus } from '../../State/Customer/Restaurant/Action';


const RestaurantDetails = () => {
  // const {restaurant} = useSelector(store => store);
  // console.log(restaurant);
  const usersRestaurant = useSelector(store => store.restaurant.usersRestaurant);
  const dispatch = useDispatch();

  const handleRestaurantStatus = () => {
    dispatch(updateRestaurantStatus({
      restaurantId: usersRestaurant.id,
      jwt: localStorage.getItem("token"),
    }))
  }


  return (
    <div className="lg:px-20 px-5">
      <div className="py-5 flex justify-center items-center gap-5">
        <h1 className="text-2xl lg:text-7xl text-center font-bold p-5">Italia Fast Food</h1>
        <div>
          <Button
            color={!usersRestaurant?.open ? "primary" : "error"}
            className="py-[1rem] px-[2rem]"
            variant="contained"
            onClick={handleRestaurantStatus}
            size="large"
          >
            {usersRestaurant?.open ? "close" : "open"}
          </Button>
        </div>
      </div>
      <Grid container spacing={2} >
        <Grid item size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title={<span className='text-gray-300'></span>}>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-200">
                <div className="flex">
                  <p className="w-48">Owner</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.user.fullName}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Restaurant Name</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.name}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Cusine Type</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.cuisineType}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Opening Hours</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.openingHours}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Status</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.open ? <span className='px-5 py-2 rounded-full bg-green-400 text-gray-950'>Open</span>
                      : <span className='px-5 py-2 rounded-full bg-red-400 text-gray-950'>Closed</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={<span className='text-gray-300'>Address</span>}>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-200">
                <div className="flex">
                  <p className="w-48">Country</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    Code With Duc
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">City</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    Code With Duc
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Postal Code</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    Code With Duc
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Street Address</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    Code With Duc
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title={<span className='text-gray-300'>Contact</span>}>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-200">
                <div className="flex">
                  <p className="w-48">Email</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.contactInfor?.email}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Mobile</p>
                  <p className="text-gray-400">
                    <span>-</span>
                    {usersRestaurant?.contactInfor?.mobile}
                  </p>
                </div>
                <div className="flex">
                  <p className="w-48">Social</p>
                  <div className='text-gray-400 flex items-center pb-3 gap-2'>
                    <span className="pr-5">-</span>
                    <a href={usersRestaurant?.contactInfor?.instagram} >
                      <InstagramIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href={usersRestaurant?.contactInfor?.twitter} >
                      <XIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href="/">
                      <LinkedInIcon sx={{ fontSize: "3rem" }} />
                    </a>
                    <a href="/">
                      <FacebookIcon sx={{ fontSize: "3rem" }} />
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </div>
  )
}

export default RestaurantDetails
