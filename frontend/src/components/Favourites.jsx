import React from 'react'
import RestaurantCard from './RestaurantCard'
import { useSelector } from 'react-redux'

const Favourites = () => {
  const {auth} = useSelector(store => store);

  return (
    <div>
      <h1 className='py-5 text-xl font-semibold text-center'>My Favorites</h1>
      <div className='flex flex-wrap gap-3 justify-center'>
        {auth.favorites.map((item, index) => <RestaurantCard key={index} item={item} />)}
      </div>
    </div>

  )
}

export default Favourites
