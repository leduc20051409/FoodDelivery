import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

const CreateIngredientForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        ingredientCategoryId: ''
    });
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: formData.name,
            ingredientCategoryId: {
                id: 1,
            },
        };
        
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
                            value={formData.ingredientCategoryId}
                            label="Category"
                            name='ingredientCategoryId'
                            onChange={handleInputChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
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
