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
  
  // Thay đổi: sử dụng object để lưu trữ anchorEl cho từng order
  const [anchorEls, setAnchorEls] = useState({});
  
  // Thay đổi: thêm state để track order hiện tại đang được update
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Thay đổi: hàm để check xem menu của order nào đang mở
  const isMenuOpen = (orderId) => Boolean(anchorEls[orderId]);

  // Thay đổi: hàm xử lý click cho từng order riêng biệt
  const handleClick = (event, orderId) => {
    setAnchorEls(prev => ({
      ...prev,
      [orderId]: event.currentTarget
    }));
    setCurrentOrderId(orderId);
  };

  // Thay đổi: hàm đóng menu cho từng order riêng biệt
  const handleClose = (orderId) => {
    setAnchorEls(prev => ({
      ...prev,
      [orderId]: null
    }));
    if (currentOrderId === orderId) {
      setCurrentOrderId(null);
    }
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

  // Thay đổi: hàm update sử dụng currentOrderId thay vì item.id trong closure
  const handleUpdateOrderStatus = (orderId, statusValue) => {
    dispatch(updateOrderStatus({
      orderId: orderId,
      orderStatus: statusValue,
      jwt: jwt,
    }));
    handleClose(orderId);
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
                      {item.items.map((orderItem, index) => 
                        <Avatar key={index} src={orderItem.food?.images[0]} />
                      )}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell align="right">{item.customer.fullName}</TableCell>
                  <TableCell align="right">{item.totalPrice}</TableCell>
                  <TableCell align="right">
                    {item.items.map((orderItem, index) => 
                      <p key={index}>{orderItem.food?.name}</p>
                    )}
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
                      id={`basic-button-${item.id}`}
                      aria-controls={isMenuOpen(item.id) ? `basic-menu-${item.id}` : undefined}
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen(item.id) ? 'true' : undefined}
                      onClick={(event) => handleClick(event, item.id)}
                      sx={{
                        color: '#f50057',
                        fontWeight: 'bold'
                      }}
                    >
                      Update
                    </Button>
                    <Menu
                      id={`basic-menu-${item.id}`}
                      anchorEl={anchorEls[item.id]}
                      open={isMenuOpen(item.id)}
                      onClose={() => handleClose(item.id)}
                      MenuListProps={{
                        'aria-labelledby': `basic-button-${item.id}`,
                      }}
                    >
                      {orderStatus.map((status) => (
                        <MenuItem
                          key={status.value}
                          onClick={() => handleUpdateOrderStatus(item.id, status.value)}
                        >
                          {status.label}
                        </MenuItem>
                      ))}
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