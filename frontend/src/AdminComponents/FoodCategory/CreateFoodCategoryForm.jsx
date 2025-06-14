import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction, getRestaurantById, getRestaurantByUserId } from '../../State/Customer/Restaurant/Action';
import { useParams } from 'react-router-dom';

const CreateFoodCategoryForm = ({handleClose}) => {
    const { id } = useParams();
    const { restaurant } = useSelector(store => store);
    const [formData, setFormData] = useState({
        categoryName: '',
        restaurantId: '',
    });
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.categoryName,
            restaurantId: {
                id: restaurant.usersRestaurant?.id
            },
        };
        dispatch(createCategoryAction({ reqData: data, jwt: localStorage.getItem("token") }));
        console.log(data);
        handleClose();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    return (
        <div>
            <div className='px-5'>
                <h1 className="text-gray-400 text-center text-xl pb-10">Create Category</h1>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="categoryName"
                        label="Name"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.categoryName}
                    />
                    <div className="flex justify-center mt-5">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Create Category
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateFoodCategoryForm
