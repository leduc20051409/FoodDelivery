import { Button, Card } from '@mui/material'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';

const AddressCart = ({item, showButton, handleSelectAddress}) => {
    return (
        <Card className="flex gap-5 w-64 p-5">
            <HomeIcon />
            <div className="space-y-3 text-gray-500">
                <h1 className="font-semibold text-lg text-white">{item.city}</h1>
                <p>
                    {item.streetAddress}, {item.stateProvince}, {item.postalCode}
                </p>
                {showButton && (<Button variant='outlined' fullWidth onChange={handleSelectAddress(item)}>Select</Button>)}
            </div>
        </Card>
    )
}

export default AddressCart
