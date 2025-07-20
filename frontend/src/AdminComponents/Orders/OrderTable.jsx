import { Box, Card, CardHeader, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, AvatarGroup, Avatar, Chip, MenuItem, Menu, Button } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantsOrder, updateOrderStatus } from '../../State/Admin/Orders/Action';

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const OrderTable = ({ status, search }) => {
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
      orderStatus: ""
    }))
  }, [jwt, dispatch, restaurant.usersRestaurant.id]);

  const filteredOrders = useMemo(() => {
    let orders = restaurantOrder.orders || [];
    if (status !== "ALL") {
      orders = orders.filter(order => order.orderStatus === status);
    }
    // Filter by search term
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      orders = orders.filter(order => {
        const orderIdMatch = order.id?.toString().includes(searchTerm);
        const customerMatch = order.customer?.fullName?.toLowerCase().includes(searchTerm);
        const foodMatch = order.items?.some(item =>
          item.food?.name?.toLowerCase().includes(searchTerm)
        );
        const ingredientMatch = order.items?.some(item =>
          item.ingredients?.some(ingredient =>
            ingredient.toLowerCase().includes(searchTerm)
          )
        );
        const statusMatch = order.orderStatus?.toLowerCase().includes(searchTerm);

        return orderIdMatch || customerMatch || foodMatch || ingredientMatch || statusMatch;
      });
    }

    return orders;
  }, [restaurantOrder.orders, status, search]);

  useEffect(() => {
    console.log("orders", restaurantOrder.orders);

  }, []);

  const handleUpdateOrderStatus = (orderId, status) => {
    dispatch(updateOrderStatus({
      orderId: orderId,
      orderStatus: status,
      jwt: jwt,
    }));
    handleClose();
  }

  return (
    <Box>
      <Card className='mt-1'>
        <CardHeader
          title={"All Orders"}
          sx={{ pt: 2, alignItems: "center", fontWeight: "bold" }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: "#1e1e1e" }}>
              <TableRow>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }}>Id</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Images</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Customer</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Price</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Name</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Ingredients</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Status</TableCell>
                <TableCell sx={{ color: "#f0f0f0", fontWeight: "bold" }} align="right">Update</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredOrders.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#2a2a2a' },
                    backgroundColor: item.id % 2 === 0 ? '#1c1c1c' : '#212121',
                  }}
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
                    {item.items?.map((orderItem, orderIndex) => (
                      <div key={orderIndex} className="mb-1">
                        {orderItem.ingredients?.map((ingredient, ingIndex) => (
                          <Chip
                            key={ingIndex}
                            label={ingredient}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.orderStatus}
                      color={
                        item.orderStatus === 'DELIVERED' || item.orderStatus === 'COMPLETED' ? 'success' :
                          item.orderStatus === 'CANCELLED' ? 'error' :
                            item.orderStatus === 'PENDING' ? 'warning' : 'primary'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                      sx={{
                        color: '#f50057',
                        fontWeight: 'bold'
                      }}
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
