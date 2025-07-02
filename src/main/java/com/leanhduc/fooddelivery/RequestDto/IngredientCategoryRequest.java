package com.leanhduc.fooddelivery.RequestDto;

import lombok.Data;

@Data
public class IngredientCategoryRequest {
    private String name;
    private Long restaurantId;
}
