package com.leanhduc.fooddelivery.RequestDto;

import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.IngredientItems;
import lombok.Data;

import java.util.List;

@Data
public class FoodRequest {
    private String name;
    private String description;
    private Long price;
    private Category category;
    private List<String> images;
    private Long restaurantId;
    private boolean vegetarian;
    private boolean seasonal;
    private List<IngredientItems> ingredientItems;

}
