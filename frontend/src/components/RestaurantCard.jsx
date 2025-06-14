import { Card, Chip, IconButton } from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourite } from '../State/Customer/Authentication/Action';
import { isPresentInFavourites } from './config/Logic';

const RestaurantCard = ({ item }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { auth } = useSelector(store => store);
    const hadleAddToFavorite = () => {
        dispatch(addToFavourite({ restaurantId: item.id, jwt }));
    };
    const handleNavigateToRestaurant = () => {
        if(!item.open) return;
        navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`);
    }

    return (
        <Card className='w-[18rem]'>
            <div className={`${item.open ? 'cursor-pointer' : "cursor-not-allowed"} relative`}>
                <img
                    className='w-full h-[10rem] rounded-t-md object-cover'
                    src={item.images[0]}
                    alt="image not found"
                />
                <Chip
                    size="small"
                    className="absolute top-2 left-2"
                    color={item.open ? "success" : "error"}
                    label={item.open ? "open" : 'closed'}
                />
            </div>
            <div className="p-4 textPart lg:flex w-full justify-between">
                <div className="space-y-1">
                    <p
                        onClick={handleNavigateToRestaurant}
                        className={`font-semibold text-lg ${
                            item.open 
                                ? "cursor-pointer" 
                                : "cursor-not-allowed text-gray-500"
                        }`}
                    >
                        {item.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                        {item.description}
                    </p>
                </div>
                <div>
                    <IconButton onClick={hadleAddToFavorite}>
                        {isPresentInFavourites(auth.favorites, item) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </div>
            </div>
        </Card >
    )
}

export default RestaurantCard
