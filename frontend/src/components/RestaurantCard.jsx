import { Card, Chip, IconButton } from '@mui/material'
import React, { useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourite } from '../State/Customer/Authentication/Action';
import { isPresentInFavourites } from './config/Logic';
import StarIcon from '@mui/icons-material/Star';
import '../css/RestaurantCard.css';

const RestaurantCard = ({ item, index }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { auth } = useSelector(store => store);
    const [isHovered, setIsHovered] = useState(false);
    
    const address = item.address
        ? `${item.address.streetAddress}, ${item.address.city}, ${item.address.stateProvince}, ${item.address.country}`
        : item.title;

    const handleAddToFavorite = (e) => {
        e.stopPropagation();
        dispatch(addToFavourite({ restaurantId: item.id, jwt }));
    };

    const handleNavigateToRestaurant = () => {
        if (!item.open) return;
        navigate(`/restaurant/${item.address.city}/${item.name}/${item.id}`);
    };

    return (
        <Card 
            className={`restaurant-card w-[18rem] ${index <= 7 ? 'animate-delay-' + index : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleNavigateToRestaurant}
        >
            <div className={`restaurant-image-container ${item.open ? 'cursor-pointer' : "cursor-not-allowed"} relative`}>
                {/* Image Overlay for Hover Effect */}
                <div className="restaurant-image-overlay" />
                
                <img
                    className={`restaurant-image rounded-t-md ${!item.open ? 'grayscale-50' : ''}`}
                    src={item.images[0]}
                    alt="Restaurant image"
                />
                
                {/* Status Chip with Enhanced Styling */}
                <Chip
                    size="small"
                    className={`restaurant-status-chip ${item.open ? 'status-open' : 'status-closed'}`}
                    label={item.open ? "OPEN" : 'CLOSED'}
                />

                {/* Gradient overlay for better visual */}
                <div className="restaurant-gradient-overlay" />
            </div>

            <div className="restaurant-content lg:flex w-full justify-between">
                <div className="space-y-2 flex-1">
                    <p
                        className={`restaurant-name ${item.open ? "cursor-pointer" : "cursor-not-allowed disabled"}`}
                    >
                        {item.name}
                    </p>
                    
                    {item.averageRating > 0 && (
                        <div className="rating-container">
                            <StarIcon 
                                fontSize="small" 
                                className="rating-star"
                            />
                            <span className="rating-number">{item.averageRating.toFixed(1)}</span>
                            <span className="rating-reviews">
                                ({item.totalReviews} reviews)
                            </span>
                        </div>
                    )}
                    
                    {address && (
                        <p className="restaurant-address">
                            {address}
                        </p>
                    )}
                </div>
                
                <div className="flex items-start">
                    <IconButton 
                        onClick={handleAddToFavorite}
                        className="favorite-icon-container"
                    >
                        {isPresentInFavourites(auth.favorites, item) ? (
                            <FavoriteIcon className="favorite-icon favorited" />
                        ) : (
                            <FavoriteBorderIcon className="favorite-icon not-favorited" />
                        )}
                    </IconButton>
                </div>
            </div>
        </Card>
    );
};

export default RestaurantCard;