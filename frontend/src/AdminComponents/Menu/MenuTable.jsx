import { Create, Delete } from '@mui/icons-material';
import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deleteFoodAction, getMenuItemsByRestaurantId } from '../../State/Customer/Menu/Action';

const MenuTable = () => {
    const orders = [1, 1, 1, 1, 1];
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant, menu } = useSelector(store => store);
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);

    useEffect(() => {
        dispatch(getMenuItemsByRestaurantId({
            restaurantId: restaurant.usersRestaurant.id,
            // isVegetarian: false,
            // isSeasonal: true,
            // isNonVegetarian: false,
            // foodCategory: ""
        }));

    }, [restaurant.usersRestaurant.id, jwt]);
    useEffect(() => {
        console.log("menu", menu);

    }, []);

    const handleDeleteClick = (foodId) => {
        setSelectedFoodId(foodId);
        setOpenDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedFoodId) {
            dispatch(deleteFoodAction({ foodId: selectedFoodId, jwt }));
        }
        setOpenDialog(false);
        setSelectedFoodId(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFoodId(null);
    };

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    action={
                        <IconButton onClick={() => navigate("/admin/restaurant/add-menu")} aria-label="settings">
                            <CreateIcon />
                        </IconButton>
                    }
                    title={"Menu"}
                    sx={{ pt: 2, alignItems: "center" }}
                />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#1e1e1e" }}>
                            <TableRow>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }}>Id</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Images</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Title</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Ingredients</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Price</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Available</TableCell>
                                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menu.menuItems.map((item, index) => (
                                <TableRow
                                    key={item.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: '#2a2a2a' },
                                        backgroundColor: index % 2 === 0 ? '#1c1c1c' : '#212121',
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {item.id}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Avatar src={item.images[0]} />
                                    </TableCell>

                                    <TableCell align="right">{item.name}</TableCell>
                                    <TableCell align="right">
                                        {item.ingredientItems.map((ingredient) =>
                                            <Chip
                                                label={ingredient.name}
                                                key={ingredient.id}
                                                size='small'
                                                sx={{ mr: 0.5, mb: 0.5 }}
                                            >
                                            </Chip>)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.price}
                                    </TableCell>
                                    <TableCell align="right">
                                        {item.available ? "Stock" : "Out of Stock"}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton color='primary' onClick={() => handleDeleteClick(item.id)} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Delete Modal */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    sx: {
                        backgroundColor: "#2b2b2b",
                        color: "#fff",
                        borderRadius: 2,
                    }
                }}
            >
                <DialogTitle sx={{ color: "#ff5252", fontWeight: "bold" }}>
                    Confirm Delete
                </DialogTitle>

                <DialogContent sx={{ fontSize: 16 }}>
                    Are you sure you want to delete <strong style={{ color: '#ffc107' }}>{menu.menuItems.find(item => item.id === selectedFoodId)?.name}</strong> from the menu?
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#90caf9",
                            '&:hover': { color: "#fff" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        sx={{
                            color: "#ff1744",
                            fontWeight: "bold",
                            '&:hover': { color: "#fff", backgroundColor: "#ff17441a" }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>

    )
}

export default MenuTable
