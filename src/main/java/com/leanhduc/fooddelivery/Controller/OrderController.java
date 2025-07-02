package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.OrderRequest;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.leanhduc.fooddelivery.Service.Order.IOrderService;
import com.leanhduc.fooddelivery.Service.Payment.IPaymentService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api/orders")
public class OrderController {
    private final IOrderService orderService;
    private final IUserService userService;
    private final IPaymentService paymentService;

    @PostMapping ("/order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody OrderRequest orderRequest,
                                             @RequestHeader ("Authorization") String jwt) throws Exception {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.createOrder(orderRequest, user);
        PaymentResponse response = paymentService.createPaymentLink(order);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping ("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader ("Authorization") String jwt){
        User user = userService.findByJwtToken(jwt);
        List<Order> orders = orderService.getUsersOrder(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping ("/order/user/{userId}")
     public ResponseEntity<List<Order>> getAllUserOrders(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long userId) {
         userService.findByJwtToken(jwt);
         List<Order> orders = orderService.getUsersOrder(userId);
         return new ResponseEntity<>(orders, HttpStatus.OK);
     }
}
