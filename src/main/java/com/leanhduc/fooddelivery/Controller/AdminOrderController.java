package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/admin/orders")
public class AdminOrderController {
    private final IOrderService orderService;
    private final IUserService userService;

    @GetMapping ("/order/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> createOrder(
            @PathVariable Long restaurantId,
            @RequestParam (required = false) String orderStatus,
            @RequestHeader ("Authorization") String jwt) throws Exception {
        userService.findByJwtToken(jwt);
        List<Order> orders = orderService.getRestaurantsOrder(restaurantId, orderStatus);
        return new ResponseEntity<>(orders, HttpStatus.CREATED);
    }

    @PutMapping ("/order/{id}/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @PathVariable String orderStatus,
            @RequestHeader ("Authorization") String jwt) {
        userService.findByJwtToken(jwt);
        Order order = orderService.updateOrder(id, orderStatus);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderDto>> getAllOrders(
            @PathVariable Long restaurantId,
            @RequestParam (required = false) String orderStatus) {
        List<Order> orders = orderService.getRestaurantsOrder(restaurantId, orderStatus);
        List<OrderDto> orderDtos = orderService.conversionToListDto(orders);
        return new ResponseEntity<>(orderDtos, HttpStatus.OK);
    }
}
