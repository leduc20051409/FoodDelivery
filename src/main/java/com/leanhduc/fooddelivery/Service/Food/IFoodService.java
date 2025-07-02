package com.leanhduc.fooddelivery.Service.Food;

import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.Food;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.RequestDto.FoodRequest;

import java.util.List;

public interface IFoodService {
    Food createFood(FoodRequest food, Category category, Restaurant restaurant);

    void deleteFood(Long foodId);

    List<Food> getRestaurantsFood(Long restaurantId,
                                  boolean isVegetarian,
                                  boolean isNonVegetarian,
                                  boolean isSeasonal,
                                  String foodCategory);

    List<Food> searchFood(String keyword, Long restaurantId);


    Food findFoodById(Long foodId) throws Exception;

    Food updateAvailabilityStatus(Long foodId) throws Exception;


}
