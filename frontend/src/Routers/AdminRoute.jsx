import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateRestaurantForm from '../AdminComponents/CreateRestaurant/CreateRestaurantForm'
import Admin from '../AdminComponents/Admin/Admin'
import { useSelector } from 'react-redux'

const AdminRoute = () => {
    const {restaurant} = useSelector(store => store);
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        // Delay nhỏ để tránh flash
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 200); // 200ms delay
        
        return () => clearTimeout(timer);
    }, []);
    
    // Hiển thị loading trong thời gian delay
    if (!isReady) {
        return <div>Loading...</div>;
    }
 
    return (
        <div>
            <Routes>
                <Route path='/*' element={!restaurant.usersRestaurant ? <CreateRestaurantForm /> : <Admin />}></Route>
            </Routes>
        </div>
    )
}

export default AdminRoute
