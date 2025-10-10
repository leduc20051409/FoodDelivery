package com.leanhduc.fooddelivery.Service.Order;

import com.leanhduc.fooddelivery.Exception.InvalidParamException;
import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.*;
import com.leanhduc.fooddelivery.Repository.AddressRepository;
import com.leanhduc.fooddelivery.Repository.OrderItemRepository;
import com.leanhduc.fooddelivery.Repository.OrderRepository;
import com.leanhduc.fooddelivery.Repository.UserRepository;
import com.leanhduc.fooddelivery.RequestDto.OrderRequest;
import com.leanhduc.fooddelivery.ResponseDto.OrderDto;
import com.leanhduc.fooddelivery.Service.Cart.ICartService;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final IRestaurantService restaurantService;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Value ("${stripe.api.key}")
    private String stripeSecretKey;

    @Override
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Order createOrder(OrderRequest orderRequest, User user) {
        Cart cart = cartService.findCartByUserId(user.getId());
        Restaurant restaurant = restaurantService.getRestaurantById(orderRequest.getRestaurantId());
        if (!restaurant.isOpen()) {
            throw new InvalidParamException("Restaurant is currently closed");
        }
        if (cart.getItems().isEmpty()) {
            throw new ResourceNotFoundException("Cart is empty, cannot create order");
        }
        for (CartItem cartItem : cart.getItems()) {
            if (!cartItem.getFood().getRestaurant().getId().equals(orderRequest.getRestaurantId())) {
                throw new InvalidParamException("All items in the cart must be from the same restaurant");
            }
        }
        Address shippingAddress = orderRequest.getDeliveryAddress();
        Address savedAddress = addressRepository.save(shippingAddress);
        if (!user.getAddresses().contains(savedAddress)) {
            user.getAddresses().add(savedAddress);
            userRepository.save(user);
        }
        Order createdOrder = new Order();
        createdOrder.setRestaurant(restaurant);
        createdOrder.setCustomer(user);
        createdOrder.setDeliveryAddress(savedAddress);
        createdOrder.setCreatAt(new Date());
        createdOrder.setOrderStatus(OrderStatus.PENDING);

        createdOrder.setPaymentMethod(orderRequest.getPaymentMethod());
        if (orderRequest.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            createdOrder.setPaymentStatus(PaymentStatus.PENDING);
        } else {
            createdOrder.setPaymentStatus(PaymentStatus.PROCESSING);
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setFood(cartItem.getFood());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setIngredients(new ArrayList<>(cartItem.getIngredients()));
            orderItem.setTotalPrice(cartItem.getPrice());

            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }
        Long totalPrice = cartService.calculateCartTotals(cart);
        createdOrder.setItems(orderItems);
        createdOrder.setTotalPrice(totalPrice);
        createdOrder.setTotalItem(orderItems.size());

        Order savedOrder = orderRepository.save(createdOrder);
        restaurant.getOrders().add(savedOrder);

        cart.getItems().clear();
        return savedOrder;
    }


    @Override
    @Transactional
    public Order updateOrder(Long orderId, String orderStatus) {
        Order order = getOrderById(orderId);
        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(orderStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Invalid order status: " + orderStatus);
        }
        order.setOrderStatus(newStatus);
        order.setUpdatedAt(new Date());
        if (newStatus == OrderStatus.PREPARING ||
                newStatus == OrderStatus.OUT_FOR_DELIVERY ||
                newStatus == OrderStatus.DELIVERED ||
                newStatus == OrderStatus.COMPLETED) {
            order.setCancellable(false);
        }
        if (newStatus == OrderStatus.DELIVERED &&
                order.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setPaymentDate(new Date());
        }
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (!order.canBeCancelled()) {
            throw new InvalidParamException("Order cannot be cancelled at this stage");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setCancelledAt(new Date());
        order.setUpdatedAt(new Date());
        order.setCancellable(false);

        if (order.getPaymentStatus() == PaymentStatus.COMPLETED) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
            processRefund(order);
        } else if (order.getPaymentStatus() == PaymentStatus.PROCESSING) {
            order.setPaymentStatus(PaymentStatus.CANCELLED);
        }

        return orderRepository.save(order);

    }

    @Override
    public boolean canCancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        return order.canBeCancelled();
    }

    @Override
    @Transactional
    public void handlePaymentSuccess(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getPaymentStatus() == PaymentStatus.PROCESSING) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
            order.setPaymentDate(new Date());
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setUpdatedAt(new Date());
            orderRepository.save(order);

//            try {
//                cartService.findCartByUserId(order.getCustomer().getId()).getItems().clear();
//            } catch (ResourceNotFoundException e) {
//                throw new ResourceNotFoundException("Cart not found for user: " + order.getCustomer().getId());
//            }
        }
    }

    @Override
    @Transactional
    public void handlePaymentFailure(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getPaymentStatus() == PaymentStatus.PROCESSING) {
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setCancelledAt(new Date());
            order.setUpdatedAt(new Date());
            order.setCancellable(false);
            orderRepository.save(order);
        }
    }

    private void processRefund(Order order) {
        if (order.getPaymentTransactionId() == null) {
            return;
        }
        try {
            Stripe.apiKey = stripeSecretKey;

            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(order.getPaymentTransactionId())
                    .setAmount(order.getTotalPrice() * 100)
                    .setReason(RefundCreateParams.Reason.REQUESTED_BY_CUSTOMER)
                    .putMetadata("order_id", order.getId().toString())
                    .putMetadata("customer_id", order.getCustomer().getId().toString())
                    .build();

            Refund refund = Refund.create(params);

            if ("succeeded".equals(refund.getStatus())) {
                order.setPaymentStatus(PaymentStatus.REFUNDED);
                order.setPaymentDate(new Date());
            } else {
                throw new InvalidParamException("Refund failed: " + refund.getFailureReason());
            }
        } catch (StripeException e) {
            throw new RuntimeException("Refund processing failed: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Refund processing failed");
        }
    }

    @Override
    public List<Order> getUsersOrder(Long userId) {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        if (orders.isEmpty()) {
            throw new ResourceNotFoundException("No orders found for this restaurant");
        }
        if (orderStatus != null && !orderStatus.isEmpty()) {
            try {
                OrderStatus status = OrderStatus.valueOf(orderStatus.trim().toUpperCase());
                orders = orders.stream()
                        .filter(order -> order.getOrderStatus().equals(status))
                        .toList();
            } catch (IllegalArgumentException e) {
                throw new InvalidParamException("Invalid order status: " + orderStatus);
            }
        }
        return orders;
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public void deleteOrder(Long orderId) {
        Order order = getOrderById(orderId);
        if (order.getOrderStatus() != OrderStatus.CANCELLED) {
            throw new InvalidParamException("Only cancelled orders can be deleted");
        }
        orderRepository.delete(order);
    }

    @Override
    public List<OrderDto> searchOrders(Long id, Long minPrice, Long maxPrice,
                                       Long customerId, String status) {
        OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new InvalidParamException("Invalid order status: " + status);
            }
        }

        List<Order> orders = orderRepository.searchOrders(id, minPrice, maxPrice,
                customerId, orderStatus);
        return conversionToListDto(orders);
    }

    @Override
    public Order getOrderByPaymentTransactionId(String paymentTransactionId) {
        return orderRepository.getOrderByPaymentTransactionId(paymentTransactionId)
                .orElseThrow(null);
    }

    @Override
    public List<OrderDto> conversionToListDto(List<Order> orders) {
        List<OrderDto> orderDtos = new ArrayList<>();
        for (Order order : orders) {
            OrderDto orderDto = modelMapper.map(order, OrderDto.class);
            orderDtos.add(orderDto);
        }
        return orderDtos;
    }

    @Override
    public OrderDto conversionDto(Order order) {
        return modelMapper.map(order, OrderDto.class);
    }
}
