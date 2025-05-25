import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, IconButton, Modal, Button } from '@mui/material'
import React, { use, useEffect } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import CreateIngredientForm from './CreateIngredientForm';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredientsOfRestaurant, updateStockOfIngredient } from '../../components/State/Ingredients/Action';

const IngredientTable = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("token");
    const { restaurant, ingredient } = useSelector(store => store);
    const orders = [1, 1, 1, 1, 1];
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const updateStoke = (id) => {
        dispatch(updateStockOfIngredient({ id, jwt }));
    }

    useEffect(() => {
        dispatch(getIngredientsOfRestaurant({ id: restaurant.usersRestaurant.id, jwt }));
    }, []);

    return (
        <Box>
            <Card className='mt-1'>
                <CardHeader
                    action={
                        <IconButton onClick={handleOpen} aria-label="settings">
                            <CreateIcon />
                        </IconButton>
                    }
                    title={"Ingredients"}
                    sx={{ pt: 2, alignItems: "center" }}
                />
                <TableContainer component={Paper} >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Category</TableCell>
                                <TableCell align="right">Avaibilty</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredient.ingredients.map((item) => (
                                <TableRow
                                    key={item.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{item.id}</TableCell>
                                    <TableCell align="right">{item.name}</TableCell>
                                    <TableCell align="right">{item.category.name}</TableCell>
                                    <TableCell align="right">
                                        <Button onClick={() => updateStoke(item.id)}>{item.stoke ? "Stock" : "Out of Stock"}</Button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <CreateIngredientForm />
                </Box>
            </Modal>
        </Box>

    )
}

export default IngredientTable
