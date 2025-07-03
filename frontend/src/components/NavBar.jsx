import { Avatar, Badge, Box, IconButton } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NotificationsSharpIcon from '@mui/icons-material/NotificationsSharp';
import LightModeIcon from '@mui/icons-material/LightMode';
import { logo } from '../assets/logo';

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
            <div className="lg:mr-10 cursor-pointer flex items-center gap-4">
                <img
                    className="w-[7rem] h-[3.5rem] object-contain"
                    src={logo.dinner_logo}
                    alt=""
                />
                <p className="text-white text-lg font-semibold hidden lg:block leading-[3.5rem]">
                    Duc food
                </p>
            </div>



            <div className="flex items-center space-x-2 lg:space-x-10">
                <div>
                    <IconButton onClick={() => navigate("/search")}>
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