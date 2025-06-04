import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createIngredientCategory } from '../../components/State/Ingredients/Action';

const CreateIngredientCategoryForm = ({ handleClose }) => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant } = useSelector(store => store);
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            restaurantId: restaurant.usersRestaurant.id,
        }

        dispatch(createIngredientCategory({ data, jwt }));
        console.log(formData);
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
                <h1 className="text-gray-400 text-center text-xl pb-10">Create Ingredient Category</h1>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Category Name"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.name}
                    />


                    <div className="flex justify-center mt-5">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Create Ingredient Category
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateIngredientCategoryForm
