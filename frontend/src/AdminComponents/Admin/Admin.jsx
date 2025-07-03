import React, { use, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Dashboard from '../Dashboard/DashBoard'
import Orders from '../Orders/Orders'
import Menu from '../Menu/Menu'
import FoodCategory from '../FoodCategory/FoodCategory'
import Ingredient from '../Ingredient/Ingredient'
import Events from '../Event/Events'
import CreateMenuForm from '../Menu/CreateMenuForm'
import RestaurantDetails from '../Details/RestaurantDetails'
import { getRestaurantsCategory } from '../../State/Customer/Restaurant/Action'


const Admin = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant, ingredient} = useSelector(store => store);
    const menuItems = useSelector(store => store.menu.menuItems);
    const handleClose = () => {

    }

    useEffect(() => {
        console.log("menu", menuItems);

    }, []);


    return (
        <div>
            <div className="lg:flex justify-between">
                <div className="">
                    <AdminSidebar handleClose={handleClose} />
                </div>
                <div className="lg:w-[80%]">
                    <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/orders' element={<Orders />} />
                        <Route path='/menu' element={<Menu />} />
                        <Route path='/category' element={<FoodCategory />} />
                        <Route path='/ingredient' element={<Ingredient />} />
                        <Route path='/event' element={<Events />} />
                        <Route path='/details' element={<RestaurantDetails />} />
                        <Route path='/add-menu' element={<CreateMenuForm />} />
                    </Routes>
                </div>
            </div>
        </div>
    )
}

export default Admin
