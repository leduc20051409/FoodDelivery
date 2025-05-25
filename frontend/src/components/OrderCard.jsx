import React from 'react'
import Card from '@mui/material/Card'
import { Button } from '@mui/material'

const OrderCard = ({order, item}) => {
    return (
        <Card className="flex justify-between items-center p-5">
            <div className="flex items-center space-x-5">
                <img
                    className="h-16 w-16"
                    src={item.food.images[0]}
                    alt=""
                />
                <div>
                    <p>{item.food.name}</p>
                    <p>${item.totalPrice}</p>
                </div>
            </div>
            <div className="">
                <Button className='cursor-not-allowed'>{order.orderStatus}</Button>
            </div>
        </Card>

    )
}

export default OrderCard
