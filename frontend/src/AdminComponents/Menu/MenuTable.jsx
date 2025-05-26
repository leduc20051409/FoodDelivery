import { Create, Delete } from '@mui/icons-material';
import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Avatar, Chip } from '@mui/material'
import React, { useEffect } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItemsByRestaurantId } from '../../components/State/Menu/Action';
import { deleteFoodAction } from '../../components/State/Menu/Action';

const MenuTable = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant, ingredient, menu } = useSelector(store => store);
    const orders = [1, 1, 1, 1, 1];
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({
            restaurantId: restaurant.usersRestaurant.id,
            isVegetarian: false,
            isSeasonal: true,
            isNonVegetarian: false,
            jwt: jwt,
            foodCategory: ""
        }));

    }, [restaurant.usersRestaurant.id, jwt]);
    useEffect(() => {
        console.log("menu", menu);

    }, []);
    
    const handleDeleteFood = (foodId) => {
        dispatch(deleteFoodAction({
            foodId,
            jwt: jwt
        }));
    }

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    action={
                        <IconButton onClick={() => navigate("/admin/restaurant/add-menu")} aria-label="settings">
                            <CreateIcon />
                        </IconButton>
                    }
                    title={"All Orders"}
                    sx={{ pt: 2, alignItems: "center" }}
                />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Id</TableCell>
                                <TableCell align="left">Images</TableCell>
                                <TableCell align="right">Title</TableCell>
                                <TableCell align="right">Ingredients</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Avaibilty</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menu.menuItems.map((item) => (
                                <TableRow
                                    key={item.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.id}
                                    </TableCell>
                                    <Avatar src={item.images[0]}></Avatar>
                                    <TableCell align="right">{item.name}</TableCell>
                                    <TableCell align="right">
                                        {item.ingredientItems.map((ingredient) => <Chip label={ingredient.name}></Chip>)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.price}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.available ? "Stock" : "Out of Stock"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color='primary' onClick={() => handleDeleteFood(item.id)} aria-label="delete"> 
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>

    )
}

export default MenuTable
