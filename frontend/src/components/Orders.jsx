import React, { useEffect } from 'react'
import OrderCard from './OrderCard'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsersOrders } from '../State/Customer/Orders/Action';

const Orders = () => {
  const { cart, auth, order } = useSelector(store => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getUsersOrders(jwt));
  }, [auth.jwt])
  

  return (
    <div className="flex items-center flex-col">
      <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
      <div className='space-y-5 w-full lg:w-1/2'>
        {
          order.orders.map((order) => order.items.map((item) => <OrderCard order={order} item={item} />))
        }
      </div>
    </div>

  )
}

export default Orders
