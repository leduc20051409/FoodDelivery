import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Box, Button, Chip, CircularProgress, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { uploadImageToCloudinary } from '../Utils/UploadToCloudinary';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createMenuItem } from '../../components/State/Menu/Action';

const initialValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    restaurantId: "",

    vegetarian: true,
    seasonal: false,
    ingredientItems: [],
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CreateMenuForm = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant, ingredient } = useSelector(store => store);
    const [uploadImage, setUploadImage] = useState(false);
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Phone number is required'),
    });
    const formik = useFormik({
        initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const data = {
                name: values.name,
                description: values.description,
                price: values.price,
                category: values.category,
                images: values.images,
                restaurantId: values.restaurantId,

                isVegetarian: values.vegetarian,
                isSeasonal: values.seasonal,
                ingredientItems: values.ingredientItems,
            };
            //dispatch(createMenuItem({ data, jwt }));
            console.log(data);
        },
    });

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setUploadImage(true);
        const image = await uploadImageToCloudinary(file);
        formik.setFieldValue("images", [...formik.values.images, image]);
        setUploadImage(false);
    }
    const handleRemoveImage = (index) => {
        const updateimages = [...formik.values.images];
        updateimages.splice(index, 1);
        formik.setFieldValue("images", updateimages);
    }


    return (
        <div className="py-10 lg:flex items-center justify-center min-h-screen">
            <div className="lg:max-w-4xl">
                <h1 className="font-bold text-2xl text-center py-2">Add Menu Item</h1>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <Grid container spacing={2}>
                        <Grid className="flex flex-wrap gap-5" size={{ xs: 12 }}>
                            <input
                                accept="image/*"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                                type="file"
                            />
                            <label className="relative" htmlFor="fileInput">
                                <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600">
                                    <AddPhotoAlternateIcon className="text-white" />
                                </span>
                                {uploadImage && (
                                    <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                                        <CircularProgress />
                                    </div>
                                )}
                            </label>

                            <div className="flex flex-wrap gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {formik.values.images.map((image, index) => (
                                        <div className='relative'>
                                            <img
                                                key={index}
                                                className="w-24 h-24 object-cover"
                                                src={image}
                                                alt=""
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{ position: "absolute", top: 0, right: 0, outline: "none" }}
                                                onClick={() => handleRemoveImage(index)}>
                                                <CloseIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <TextField
                                fullWidth
                                id="price"
                                name="price"
                                label="Price"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.price}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.category}
                                    label="Category"
                                    name='category'
                                    onChange={formik.handleChange}
                                >
                                    {restaurant.categories.map((item) => <MenuItem value={item}>{item.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Ingredients</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    name="ingredientItems"
                                    multiple
                                    value={formik.values.ingredientItems}
                                    onChange={formik.handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Ingredients" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {ingredient.ingredients.map((item, index) => (
                                            <MenuItem
                                                key={item.id}
                                                value={item}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">isVegetarian</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.vegetarian}
                                    label="isVegetarian"
                                    name='vegetarian'
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">isSeasonal</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formik.values.seasonal}
                                    label="isSeasonal"
                                    name='seasonal'
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value={true}>Yes</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>


                    </Grid>
                    <Button
                        className='mt-5'
                        variant='contained'
                        color='primary'
                        type='submit'>
                        Create Menu Item
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default CreateMenuForm
