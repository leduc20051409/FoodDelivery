import React from 'react'
import ProfileNavigation from '../components/ProfileNavigation'
import { Route, Routes } from 'react-router-dom'
import UserProfile from '../components/UserProfile'
import Address from '../components/Address'
import Favourites from '../components/Favourites'
import Events from '../components/Events'
import Orders from '../components/Orders'
const Profile = () => {
    return (
        <div className="lg:flex justify-between">
            <div className="sticky h-[80vh] lg:w-[20%]">
                <ProfileNavigation />
            </div>
            <div className="lg:w-[80%]">
                <Routes>
                    <Route path="/" element={<UserProfile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/address" element={<Address />} />
                    <Route path="/favorites" element={<Favourites />} />
                    <Route path="/events" element={<Events />} />
                </Routes>
            </div>
        </div>
    )
}

export default Profile
