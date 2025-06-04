import React from 'react'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Chip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeCartItem, updateCartItem } from '../State/Customer/Cart/Action';


const CartItem = ({ item }) => {
    const demo = [1, 1, 1, 1];
    const { cart, auth } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const jwt = localStorage.getItem("token");

    const handleUpdateQuantity = (value) => {
        if(value == -1 && item.quantity == 1) {
            handleRemoveItemFromCart();
        }
        const data = {cartItemId: item.id, quantity:item.quantity + value};
        dispatch(updateCartItem({data: data, jwt: jwt}));
    }
    const handleRemoveItemFromCart = () => {
        const reqData = {
            jwt: jwt,
            cartItemId: item.id
        };
        dispatch(removeCartItem(reqData));
    }
    console.log("cart item ", item);


    return (
        <div className="px-5">
            <div className="lg:flex items-center lg:space-x-5">
                <div>
                    <img
                        className="w-[5rem] h-[5rem] object-cover"
                        src={item.food.images[0]}
                        alt=""
                    />
                </div>
                <div className="flex items-center justify-between lg:w-[70%]">
                    <div className="space-y-1 lg:space-y-3 w-full">
                        <p>{item.food.name}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                                <IconButton onClick={() => handleUpdateQuantity(-1)}>
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                                <div className="w-5 h-5 text-xs flex items-center justify-center">
                                    {item.quantity}
                                </div>
                                <IconButton onClick={() => handleUpdateQuantity(1)}>
                                    <AddCircleOutlineIcon />
                                </IconButton>
                            </div>

                        </div>
                    </div>
                    <p>${item.food.price}</p>
                </div>
            </div>
            <div className="pt-3 space-x-2">
                {item.ingredients.map((ingredient) => <Chip label={ingredient} />)}
            </div>
        </div>
    )
}

export default CartItem
