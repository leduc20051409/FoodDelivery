import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../components/State/Ingredients/Action';

const CreateIngredientForm = () => {
    const { restaurant, ingredient } = useSelector(store => store);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: ''
    });
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            restaurantId: restaurant.usersRestaurant.id,
        };
        dispatch(createIngredient({ data: data, jwt: jwt }));
        console.log(data);

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
                <h1 className="text-gray-400 text-center text-xl pb-10">Create Ingredient</h1>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Name"
                        variant="outlined"
                        onChange={handleInputChange}
                        value={formData.name}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.categoryId}
                            label="Category"
                            name='categoryId'
                            variant="outlined"
                            onChange={handleInputChange}
                        >
                            {ingredient.category.map((item) => <MenuItem value={item.id}>{item.name}</MenuItem>)}

                        </Select>
                    </FormControl>

                    <div className="flex justify-center mt-5">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Create Ingredient
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateIngredientForm
