import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography, TextField, Box } from '@mui/material';
import React, { useState } from 'react';
import OrderTable from './OrderTable';

const Orders = () => {
  const orderStatus = [
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Preparing", value: "PREPARING" },
    { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "All", value: "ALL" },
  ];

  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState("ALL");

  const handleFilter = (e) => {
    setFilterValue(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="px-2">
      <Card className="p-5">
        <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
          Order Status
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl>
            <RadioGroup
              onChange={handleFilter}
              row
              name="category"
              value={filterValue || "ALL"}
            >
              {orderStatus.map((status) => (
                <FormControlLabel
                  key={status.value}
                  value={status.value}
                  control={<Radio />}
                  label={status.label}
                  sx={{ color: "gray" }}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl variant="outlined" size="small">
            <TextField
              placeholder="Search orders"
              name="search"
              value={search}
              onChange={handleSearchChange}
              size="small"
              variant="outlined"
              sx={{ maxWidth: 200 }}
            />
          </FormControl>
        </Box>
      </Card>
      <OrderTable status={filterValue} search={search} />
    </div>
  );
};

export default Orders;