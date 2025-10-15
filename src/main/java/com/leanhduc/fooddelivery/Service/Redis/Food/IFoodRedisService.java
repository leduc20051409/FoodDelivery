package com.leanhduc.fooddelivery.Service.Redis.Food;

import com.leanhduc.fooddelivery.Model.Food;

import java.util.List;

public interface IFoodRedisService {
    void saveFoodByRestaurant(Long restaurantId, List<Food> foods);
    void deleteFoodCacheByRestaurant(Long restaurantId);
    List<Food> getFoodByRestaurant(Long restaurantId);
    void clearAll();

}
