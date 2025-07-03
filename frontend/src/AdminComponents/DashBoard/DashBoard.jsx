import { Grid } from '@mui/material'
import React from 'react'
import MenuTable from '../Menu/MenuTable'
import OrderTable from '../Orders/OrderTable'

const DashBoard = () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, sm: 6}} item>
          <MenuTable />
        </Grid>
        <Grid size={{xs: 12, sm: 6}} item>
          <OrderTable />
        </Grid>
      </Grid>
    </div>
  )
}

export default DashBoard
