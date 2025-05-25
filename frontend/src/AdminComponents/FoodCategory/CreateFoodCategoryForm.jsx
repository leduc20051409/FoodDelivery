import { Button, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createCategoryAction } from '../../components/State/Restaurant/Action';

const CreateFoodCategoryForm = () => {
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
                id: 1,
            },
        };
        dispatch(createCategoryAction({ reqData: data, jwt: localStorage.getItem("token") }));
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
