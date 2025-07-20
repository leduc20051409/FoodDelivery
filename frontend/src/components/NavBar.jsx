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
        <Box className="px-5 fixed top-0 left-0 right-0 z-50 py-[0.8rem] bg-[#e91e63] lg:px-20 flex justify-between">
            <div
                onClick={() => navigate("/")}
                className="lg:mr-10 cursor-pointer flex items-center gap-4"
            >
                <img
                    className="w-[6rem] h-[3.5rem] object-contain"
                    src={logo.dinner_logo}
                    alt=""
                />
                <div
                    className="text-white font-semibold hidden lg:flex flex-col justify-center h-[3.5rem] leading-none gap-[0.2rem]"
                >
                    <span className="text-[1.2rem] pacifico-regular font-extrabold">Duc</span>
                    <span className="text-[1.2rem] pacifico-regular font-extrabold">food</span>
                </div>
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