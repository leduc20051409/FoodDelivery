import { use, useEffect, useState } from 'react'
import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { darkTheme } from './theme/DarkTheme'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './components/State/Authentication/Action'
import { findCart } from './components/State/Cart/Action'
import Router from './Routers/Router'
import { getRestaurantByUserId } from './components/State/Restaurant/Action'


function App() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { auth } = useSelector(store => store);
  
  useEffect(() => {
    dispatch(getUser(jwt || auth.jwt));
    dispatch(findCart(jwt || auth.jwt));
  }, [auth.jwt]);

  useEffect(() => {
    dispatch(getRestaurantByUserId(jwt || auth.jwt));
  }, [auth.jwt]);


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  )
}

export default App
