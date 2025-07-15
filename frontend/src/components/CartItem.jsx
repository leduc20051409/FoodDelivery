import React, { useEffect } from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeCartItem, updateCartItem } from '../State/Customer/Cart/Action';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { isPresentInFavourites } from './config/Logic';


const CartItem = ({ item }) => {
    const demo = [1, 1, 1, 1];
    const { cart, auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("token");

    const handleUpdateQuantity = (value) => {
        if (value == -1 && item.quantity == 1) {
            handleRemoveItemFromCart();
        }
        const data = { cartItemId: item.id, quantity: item.quantity + value };
        dispatch(updateCartItem({ data: data, jwt: jwt }));
    }

    const handleRemoveItemFromCart = () => {
        const reqData = {
            jwt: jwt,
            cartItemId: item.id
        };
        dispatch(removeCartItem(reqData));
    }

    useEffect(() => {
        console.log("cart item ", item);
    }, [])

    return (
        <div className="px-5">
            {/* SHOP HEADER */}
            <div className="border-b pb-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                    {isPresentInFavourites(auth.favorites, item.food.restaurant) &&
                        <span className="text-red-500 font-semibold">Favourite</span>
                    }
                    <span className="font-bold text-base">{item.food.restaurant?.name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/restaurant/${item.food.restaurant?.address?.city}/${item.food.restaurant?.name}/${item.food.restaurant?.id}`)}
                        className="text-xs text-gray-400 border border-gray-400 hover:text-white hover:bg-red-600 hover:border-red-600 px-2 py-1 hover:cursor-pointer  transition-colors"
                    >
                        <StorefrontIcon sx={{ color: 'white' }} fontSize='small'/> View Restaurant
                    </button>
                </div>
            </div>
            {/* FOOD ITEM DETAILS */}
            <div className="lg:flex items-center lg:space-x-5 pt-2">
                <div>
                    <img
                        className="w-[5rem] h-[5rem] object-cover"
                        src={item.food.images[0]}
                        alt=""
                    />
                </div>
                <div className="flex items-center justify-between lg:w-[70%]">
                    <div className="space-y-1 lg:space-y-3 w-full">
                        <div className="flex justify-between items-center">
                            <p>{item.food.name}</p>
                            {/* Nút xóa item */}
                            <IconButton
                                onClick={handleRemoveItemFromCart}
                                size="small"
                                sx={{ color: '#ef4444', '&:hover': { color: '#dc2626' } }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                                <IconButton onClick={() => handleUpdateQuantity(-1)} disabled={item.quantity === 1}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                                <div className="w-5 h-5 text-xs flex items-center justify-center">
                                    {item.quantity}
                                </div>
                                <IconButton onClick={() => handleUpdateQuantity(1)}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>
                            <p>${item.food.price}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-3 space-x-2">
                <div className="pt-3 flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, idx) => (
                        <Chip key={idx} label={ingredient} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CartItem