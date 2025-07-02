package com.leanhduc.fooddelivery.RequestDto;

import com.leanhduc.fooddelivery.Model.Address;
import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
}
