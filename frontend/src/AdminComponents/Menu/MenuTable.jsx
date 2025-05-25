import { Create, Delete } from '@mui/icons-material';
import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, IconButton } from '@mui/material'
import React from 'react'
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const MenuTable = () => {
    const orders = [1, 1, 1, 1, 1];
    const navigate = useNavigate();
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
                                <TableCell align="left">Images</TableCell>
                                <TableCell align="right">TiTle</TableCell>
                                <TableCell align="right">Intgredients</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Avaibilty</TableCell>
                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {1}
                                    </TableCell>
                                    <TableCell align="right">{"image"}</TableCell>
                                    <TableCell align="right">{"customer@gmail.com"}</TableCell>
                                    <TableCell align="right">{"500"}</TableCell>
                                    <TableCell align="right">{"Name"}</TableCell>
                                    <TableCell align="right">
                                        <IconButton>
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
