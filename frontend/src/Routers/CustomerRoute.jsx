import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'

import Cart from '../pages/Cart'
import Profile from '../pages/Profile'
import NavBar from '../components/NavBar'
import RestaurentDetail from '../pages/RestaurentDetail'
import PaymentSuccess from '../components/PaymentSuccess/PaymentSuccess'
import Search from '../components/Search/Search'
import CheckoutPage from '../components/Order/CheckoutPage.'
import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import MainLayout from '../components/layout/MainLayout'
import EmptyLayout from '../components/layout/EmptyLayout'
const CustomerRoute = () => {
    return (
        <div>
            <Routes>
                <Route element={<EmptyLayout />}>
                    <Route path="/auth/reset-password/:token" element={<ResetPasswordForm />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/account/register" element={<Home />} />
                    <Route path="/account/login" element={<Home />} />
                    <Route path="/account/forgot-password" element={<Home />} />
                    <Route path="/restaurant/:city/:title/:id" element={<RestaurentDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path='/cart/checkout' element={<CheckoutPage />} />
                    <Route path="/my-profile/*" element={<Profile />} />
                    <Route path='/search' element={<Search />} />
                    <Route path="/payment/success/:id" element={<PaymentSuccess />} />
                </Route>
            </Routes>
        </div>
    )
}

export default CustomerRoute
