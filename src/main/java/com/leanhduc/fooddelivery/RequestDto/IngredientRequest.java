package com.leanhduc.fooddelivery.RequestDto;

import lombok.Data;

@Data
public class IngredientRequest {
    private String name;
    private Long categoryId;
    private Long restaurantId;
}
