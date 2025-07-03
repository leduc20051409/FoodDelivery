import React from 'react'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddReaction from '@mui/icons-material/AddReaction';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider, useMediaQuery } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../State/Customer/Authentication/Action';
const ProfileNavigation = ({ open, handleClose }) => {
    const menu = [
        { title: "Orders", icon: <ShoppingBagIcon /> },
        { title: "Favorites", icon: <FavoriteIcon /> },
        { title: "Address", icon: <AddReaction /> },
        { title: "Payments", icon: <AccountBalanceWalletIcon /> },
        { title: "Notification", icon: <NotificationsActiveIcon /> },
        { title: "Events", icon: <EventIcon /> },
        { title: "Logout", icon: <LogoutIcon /> },
    ];
    const isSmallScreen = useMediaQuery('(max-width:1080)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigate = (item) => {
        if(item.title === "Logout"){
            dispatch(logOut());
            navigate("/")
        } else { 
            navigate(`/my-profile/${item.title.toLowerCase()}`);
        }
    } 
    return (
        <div>
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                onClose={handleClose}
                open={open}
                anchor="left"
                sx={{ zIndex: 1 }}
            >
                <div className="w-[50vw] lg:w-[20vw] h-[100vh] flex flex-col justify-center text-xl gap-8 pt-16">
                    {menu.map((item, i) => (
                        <>
                            <div onClick={() => handleNavigate(item)} className="px-5 flex items-center space-x-5 cursor-pointer">
                                {item.icon}
                                <span>{item.title}</span>
                            </div>
                            {i !== menu.length - 1 && <Divider />}
                        </>
                    ))}
                </div>
            </Drawer>
        </div>
    )
}

export default ProfileNavigation
