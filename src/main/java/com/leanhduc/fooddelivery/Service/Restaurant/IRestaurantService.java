package com.leanhduc.fooddelivery.Service.Restaurant;

import com.leanhduc.fooddelivery.ResponseDto.RestaurantDto;
import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.RestaurantRequest;

import java.util.List;

public interface IRestaurantService {
    Restaurant createRestaurant(RestaurantRequest restaurantRequest, User user) throws AlreadyExistsException;

    Restaurant getRestaurantById(Long id);

    List<Restaurant> getAllRestaurants();

    Restaurant updateRestaurant(Long id, RestaurantRequest restaurantRequest);

    void deleteRestaurant(Long id);

    List<Restaurant> searchRestaurant(String keyword);

    Restaurant getRestaurantByUserId(Long userId);

    RestaurantDto addToFavorites(Long restaurantId, User user);

    Restaurant updateRestaurantStatus(Long id);
}
