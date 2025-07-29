package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.PaymentMethod;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.OrderRequest;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Response.PaymentResponse;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;
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

    @PostMapping("/order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest,
                                         @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.createOrder(orderRequest, user);

        if (orderRequest.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            OrderDto orderDto = orderService.conversionDto(order);
            return new ResponseEntity<>(orderDto, HttpStatus.CREATED);
        } else {
            try {
                PaymentResponse response = paymentService.createPaymentLink(order);
                return new ResponseEntity<>(response, HttpStatus.CREATED);
            } catch (Exception e) {
                orderService.handlePaymentFailure(order.getId());
                return new ResponseEntity<>("Payment failed: " + e.getMessage(),
                        HttpStatus.PAYMENT_REQUIRED);
            }
        }
    }
    @GetMapping ("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader ("Authorization") String jwt) {
        User user = userService.findByJwtToken(jwt);
        List<Order> orders = orderService.getUsersOrder(user.getId());
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping ("/order/user/{userId}")
    public ResponseEntity<List<Order>> getAllUserOrders(
            @RequestHeader ("Authorization") String jwt,
            @PathVariable Long userId) {
        userService.findByJwtToken(jwt);
        List<Order> orders = orderService.getUsersOrder(userId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @PutMapping ("/order/cancel/{orderId}")
    public ResponseEntity<OrderDto> cancelOrder(
            @RequestHeader ("Authorization") String jwt,
            @PathVariable Long orderId) {
        userService.findByJwtToken(jwt);
        Order order = orderService.cancelOrder(orderId);
        OrderDto orderDto = orderService.conversionDto(order);
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @GetMapping ("/order/{orderId}")
    public ResponseEntity<OrderDto> getOrderDetails(
            @RequestHeader ("Authorization") String jwt,
            @PathVariable Long orderId) {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.getOrderById(orderId);
        if (!order.getCustomer().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        OrderDto orderDto = orderService.conversionDto(order);
        return new ResponseEntity<>(orderDto, HttpStatus.OK);
    }

    @GetMapping ("/order/{orderId}/can-cancel")
    public ResponseEntity<Boolean> canCancelOrder(
            @RequestHeader ("Authorization") String jwt,
            @PathVariable Long orderId) {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.getOrderById(orderId);
        if (!order.getCustomer().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        boolean canCancel = orderService.canCancelOrder(orderId);
        return new ResponseEntity<>(canCancel, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<MessageResponse> deleteOrder(
            @RequestHeader ("Authorization") String jwt,
            @PathVariable Long orderId) {
        User user = userService.findByJwtToken(jwt);
        Order order = orderService.getOrderById(orderId);
        if (!order.getCustomer().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        orderService.deleteOrder(orderId);
        return new ResponseEntity<>(
                new MessageResponse("Order deleted successfully"),
                HttpStatus.OK
        );
    }
}
