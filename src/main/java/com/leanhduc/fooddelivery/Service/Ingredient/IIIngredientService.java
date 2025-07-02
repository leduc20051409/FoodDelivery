package com.leanhduc.fooddelivery.Service.Ingredient;

import com.leanhduc.fooddelivery.Model.IngredientCategory;
import com.leanhduc.fooddelivery.Model.IngredientItems;

import java.util.List;

public interface IIIngredientService {
    IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception;

    IngredientCategory findIngredientCategoryById(Long id) throws Exception;

    List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception;

    IngredientItems createIngredientItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception;

    List<IngredientItems> findRestaurantsIngredients(Long restaurantId);

    IngredientItems updateStock(Long id);
}
