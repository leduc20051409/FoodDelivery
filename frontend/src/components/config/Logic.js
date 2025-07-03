export const isPresentInFavourites = (favourites, restaurant) => {
    for(let item of favourites) {
        if(item.id === restaurant.id) {
            return true;
        }
    }
    return false;
}
