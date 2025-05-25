import { Divider, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuCard from '../components/MenuCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantById, getRestaurantsCategory } from '../components/State/Restaurant/Action';
import { getMenuItemsByRestaurantId } from '../components/State/Menu/Action';

const RestaurentDetail = () => {
    const categories = [
        "pizza",
        "biryani",
        "burger",
        "chiken",
        "rice"
    ];

    const foodTypes = [
        { label: "All", value: "all" },
        { label: "Vegetarian only", value: "vegetarian" },
        { label: "Non-Vegetarian", value: "non_vegetarian" },
        { label: "Seasonal", value: "seasonal" }
    ];
    //const menu = [1, 1, 1, 1, 1];
    const [foodType, setFoodType] = useState("all");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { auth, restaurant, menu } = useSelector(store => store);
    const { id, city } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("");
    console.log("restaurant", restaurant);

    useEffect(() => {
        dispatch(getRestaurantById({ jwt, restaurantId: id }));
        dispatch(getRestaurantsCategory({ jwt, restaurantId: id }));

    }, []);

    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({
            jwt, restaurantId: id,
            isVegetarian: foodType === "vegetarian",
            isNonVegetarian: foodType === "non_vegetarian",
            isSeasonal: foodType === "seasonal",
            foodCategory: selectedCategory || ""
        }));
    }, [selectedCategory, foodType]);

    const handleFilterCategory = (e) => {
        setSelectedCategory(e.target.value);
    }

    return (
        <div className='px-5 lg:px-20'>
            <section>
                <h3 className='text-gray-500 py-2 mt-10'>{restaurant.restaurant?.name}</h3>
                <div>
                    <Grid container spacing={2}>
                        <Grid item xs={12} className='w-full'>
                            <img
                                className='w-full h-[40vh] object-cover'
                                src={restaurant.restaurant?.images[0]}
                                alt=""
                            />
                        </Grid>

                        <Grid item xs={12} lg={6} className='w-[calc(50%-4px)]'>
                            <img
                                className='w-full h-[40vh] object-cover'
                                src={restaurant.restaurant?.images[1]}
                                alt=""
                            />
                        </Grid>
                        <Grid item xs={12} lg={6} className='w-[calc(50%-15px)]'>
                            <img
                                className='w-full h-[40vh] object-cover'
                                src="https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                alt=""
                            />
                        </Grid>

                    </Grid>
                </div>

                <div className="pt-3 pb-5">
                    <h1 className="text-4xl font-semibold">{restaurant.restaurant?.cuisineType} Fast Food</h1>
                    <p className="text-gray-500">{restaurant.restaurant?.description}</p>
                    <div className="space-y-3 mt-3">
                        <p className="text-gray-500 flex items-center gap-3">
                            <LocationOnIcon />
                            <span>123 Main Street, Anytown, USA</span>
                        </p>
                        <p className="text-gray-500 flex items-center gap-3">
                            <CalendarTodayIcon />
                            <span>Monday to Friday - 9:00am to 10:00pm</span>
                        </p>
                    </div>
                </div>
            </section>

            <Divider />
            <section className="pt-[2rem] lg:flex relative">
                <div className="space-y-10 lg:w-[20%] filter p-5 shadow-md">
                    <div className="box space-y-5 lg:sticky top-28 ">
                        {/* Food Type */}
                        <div>
                            <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                                Food Type
                            </Typography>
                            <FormControl className="py-10 space-y-5" component={"fieldset"}>
                                <RadioGroup onChange={(e) => setFoodType(e.target.value)} name="food_type" value={foodType}>
                                    {foodTypes.map((item) => (
                                        <FormControlLabel
                                            key={item.value}
                                            value={item.value}
                                            control={<Radio />}
                                            label={item.label}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                        {/* Food Category */}
                        <div>
                            <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                                Food Category
                            </Typography>
                            <FormControl className="py-10 space-y-5" component={"fieldset"}>
                                <RadioGroup onChange={handleFilterCategory} name="food_type" value={selectedCategory}>
                                    {restaurant.categories.map((item) => (
                                        <FormControlLabel
                                            key={item.id}
                                            value={item.name}
                                            control={<Radio />}
                                            label={item.name}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="space-y-5 lg:w-[80%] lg:pl-10">
                    {menu.menuItems.map((item, index) => <MenuCard item={item} key={index} />)}
                </div>
            </section>

        </div>
    )
}

export default RestaurentDetail
