import React from 'react'
import { Dashboard, ShoppingBag } from '@mui/icons-material';
import { ShopTwo as ShopTwoIcon, Category as CategoryIcon, Fastfood as FastfoodIcon, Event as EventIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { Divider, Drawer, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../../components/State/Authentication/Action';
const AdminSidebar = ({ handleClose }) => {
    const menu = [
        { title: "Dashboard", icon: <Dashboard />, path: "/" },
        { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
        { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
        { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
        { title: "Ingredients", icon: <FastfoodIcon />, path: "/ingredient" },
        { title: "Events", icon: <EventIcon />, path: "/event" },
        { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
        { title: "Logout", icon: <LogoutIcon />, path: "/" },
    ];
    const isSmallScreen = useMediaQuery('(max-width:1080)');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleNavigate = (item) => {
        navigate(`/admin/restaurant${item.path}`)
        if (item.title == 'logout') {
            navigate('/');
            dispatch(logOut());
        }
    }
    return (
        <div className="">
            <React.Fragment>

                <Drawer
                    variant={isSmallScreen ? "temporary" : "permanent"}
                    onClose={handleClose}
                    open={true}
                    anchor='left'
                    sx={{ zIndex: 1 }}
                >
                    <div className='w-[70vw] lg:w-[20vw] h-screen flex flex-col justify-center text-xl space-y-[1.65rem]'>
                        {menu.map((item, i) => (
                            <>
                                <div onClick={() => handleNavigate(item)} className='px-5 py-5 flex items-center gap-5 cursor-pointer'>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </div>
                                {i != menu.length - 1 && <Divider />}
                            </>
                        ))}
                    </div>
                </Drawer>
            </React.Fragment>
        </div>
    )
}

export default AdminSidebar
