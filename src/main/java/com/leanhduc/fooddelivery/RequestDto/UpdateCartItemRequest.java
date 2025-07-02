package com.leanhduc.fooddelivery.RequestDto;

import lombok.Data;

@Data
public class UpdateCartItemRequest {
    private Long cartItemId;
    private int quantity;
}
