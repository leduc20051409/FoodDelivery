import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'

import Cart from '../pages/Cart'
import Profile from '../pages/Profile'
import NavBar from '../components/NavBar'
import RestaurentDetail from '../pages/RestaurentDetail'
import PaymentSuccess from '../components/Payment/PaymentSuccess'
import Search from '../components/Search/Search'

import ResetPasswordForm from '../components/auth/ResetPasswordForm'
import EmptyLayout from '../layout/EmptyLayout'
import MainLayout from '../layout/MainLayout'
import GoogleCallback from '../components/auth/GoogleCallback'
import CheckoutPage from '../pages/CheckoutPage.'
import PaymentCancel from '../components/Payment/PaymentCancel'

const CustomerRoute = () => {
    return (
        <div>
            <Routes>
                <Route element={<EmptyLayout />}>
                    <Route path="/auth/reset-password/:token" element={<ResetPasswordForm />} />
                    <Route path="/login/oauth2/code/google" element={<GoogleCallback />} />
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
                    <Route path="/payment/success/:sessionId" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel/:sessionId" element={<PaymentCancel />} />
                </Route>
            </Routes>
        </div>
    )
}

export default CustomerRoute
