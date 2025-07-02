package com.leanhduc.fooddelivery.ResponseDto;

import com.leanhduc.fooddelivery.Model.Address;
import com.leanhduc.fooddelivery.Model.OrderItem;
import com.leanhduc.fooddelivery.Model.User;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderDto {
    private Long id;
    private User customer;
    private Long totalAmount;
    private String orderStatus;
    private Date creatAt;
    private Address deliveryAddress;
    private List<OrderItem> items;
    private int totalItem;
    private Long totalPrice;
}
