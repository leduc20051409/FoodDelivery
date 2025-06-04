import { Avatar, Badge, Box, IconButton } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
const NavBar = () => {
    const { auth, cart } = useSelector(store => store);
    const navigate = useNavigate();
    const handleAvatarClick = () => {
        if (auth.user.role === "ROLE_CUSTOMER") {
            navigate("/my-profile")
        } else {
            navigate("/admin/restaurant")
        }
    }
    return (
        <Box className="px-5 sticky z-50 py-[0.8rem] bg-[#e91e63] lg:px-20 flex justify-between">
            <div className="lg:mr-10 cursor-pointer flex items-center space-x-4">
                <li onClick={() => navigate("/")} className="logo font-semibold text-gray-300 text-2xl">
                    Duc food
                </li>
            </div>


            <div className="flex items-center space-x-2 lg:space-x-10">
                <div>
                    <IconButton>
                        <SearchIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                </div>
                <div>
                    {auth.user ?
                        <Avatar onClick={handleAvatarClick} sx={{ bgcolor: 'white', color: 'pink.A400' }}>
                            {auth.user.fullName[0].toUpperCase()}
                        </Avatar> :
                        <IconButton onClick={() => navigate("/account/login")}>
                            <PersonIcon />
                        </IconButton>}
                </div>
                <div>
                    <IconButton onClick={() => navigate("/cart")}>
                        <Badge color='secondary' badgeContent={cart.cart?.items.length}>
                            <ShoppingCartIcon sx={{ fontSize: '1.5rem' }}>C</ShoppingCartIcon>
                        </Badge>
                    </IconButton>
                </div>
                <div className="">
                    <IconButton >
                        <NotificationsSharpIcon />
                    </IconButton>
                </div>
            </div>
        </Box>
    )
}

export default NavBar