import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, AvatarGroup, Avatar, Chip, MenuItem, Menu, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsOrder, updateOrderStatus } from '../../State/Admin/Orders/Action';

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "All", value: "ALL" },
];

const OrderTable = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { restaurant, restaurantOrder, ingredient, menu } = useSelector(store => store);
  const orders = [1, 1, 1, 1, 1];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(fetchRestaurantsOrder({
      restaurantId: restaurant.usersRestaurant.id,
      jwt: jwt,
    }))
  }, [])
  useEffect(() => {
    console.log("orders", restaurantOrder);
  }, []);

  const handleUpdateOrderStatus = (orderId, status) => {
    dispatch(updateOrderStatus({
      orderId: orderId,
      status: status,
      jwt: jwt,
    }));
    handleClose();
  }

  return (
    <Box>
      <Card className='mt-1'>
        <CardHeader
          title={"All Orders"}
          sx={{ pt: 2, alignItems: "center" }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Images</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Intgredients</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantOrder.orders.map((item) => (
                <TableRow
                  key={item.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell align="right">
                    <AvatarGroup>
                      {item.items.map((orderItem) => <Avatar src={orderItem.food?.images[0]} />)}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell align="right">{item.customer.fullName}</TableCell>
                  <TableCell align="right">{item.totalPrice}</TableCell>
                  <TableCell align="right">
                    {item.items.map((orderItem) => <p>{orderItem.food?.name}</p>)}
                  </TableCell>
                  <TableCell align="right">
                    {item.items.map((orderItem) => (
                      <div className="">
                        {orderItem.ingredients.map((ingredient) => <Chip label={ingredient}></Chip>)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">{item.orderStatus}</TableCell>
                  <TableCell align="right">
                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      Update
                    </Button>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      {orderStatus.map((status) => <MenuItem
                        onClick={() => handleUpdateOrderStatus(item.id, status.value)}>
                        {status.label}
                      </MenuItem>)}
                    </Menu>
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

export default OrderTable
