import React from 'react'
import Title from '../Title'

const CartTotals = ( {item}) => {
  
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${item.total}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>${21}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>GST and Reataurant Charges</p>
          <p>${33}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>${item.total + 21 + 33} </b>
        </div>
      </div>
    </div>
  )
}

export default CartTotals
