export const isPresentInFavourites = (favourites, restaurant) => {
    for(let item of favourites) {
        if(item.id === restaurant.id) {
            return true;
        }
    }
    return false;
}

export const isSameRestaurant = (cartItems = []) => {
  if (cartItems.length === 0) return true;
  return cartItems.every(
    item => item.food.restaurant.id === cartItems[0].food.restaurant.id
  );
};

