package com.leanhduc.fooddelivery.ResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
    private Long id;
    private String foodName;
    private int quantity;
    private Long totalPrice;
    private List<String> ingredients;
}
