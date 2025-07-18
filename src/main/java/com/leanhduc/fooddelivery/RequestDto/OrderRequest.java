package com.leanhduc.fooddelivery.RequestDto;

import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.PaymentMethod;
import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
    private PaymentMethod paymentMethod;
    private String paymentTransactionId;
}
