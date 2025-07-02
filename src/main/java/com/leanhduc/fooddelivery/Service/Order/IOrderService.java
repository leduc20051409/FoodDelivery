package com.leanhduc.fooddelivery.Service.Order;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.OrderRequest;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderRequest orderRequest, User user) throws Exception;

    Order updateOrder(Long orderId, String orderStatus);

    void cancelOrder(Long orderId);

    List<Order> getUsersOrder(Long userId);

    List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus);

    Order getOrderById(Long orderId);

    List<OrderDto> conversionToListDto(List<Order> orders);

    OrderDto conversionDto(Order order);
}
