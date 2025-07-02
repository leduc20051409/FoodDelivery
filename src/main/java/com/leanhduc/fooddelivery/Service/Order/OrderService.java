package com.leanhduc.fooddelivery.Service.Order;

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
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final IRestaurantService restaurantService;
    private final ICartService cartService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Order createOrder(OrderRequest orderRequest, User user) throws Exception {
        Address shippingAddress = orderRequest.getDeliveryAddress();
        Address savedAddress = addressRepository.save(shippingAddress);
        if (!user.getAddresses().contains(savedAddress)) {
            user.getAddresses().add(savedAddress);
            userRepository.save(user);
        }
        Restaurant restaurant = restaurantService.getRestaurantById(orderRequest.getRestaurantId());

        Order createdOrder = new Order();
        createdOrder.setRestaurant(restaurant);
        createdOrder.setCustomer(user);
        createdOrder.setDeliveryAddress(savedAddress);
        createdOrder.setCreatAt(new Date());
        createdOrder.setOrderStatus("PENDING");

        Cart cart = cartService.findCartByUserId(user.getId());
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

        Order savedOrder = orderRepository.save(createdOrder);
        restaurant.getOrders().add(savedOrder);
        return savedOrder;
    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) {
        Order order = getOrderById(orderId);
        if (orderStatus.equals("OUT_FOR_DELIVERY")
                || orderStatus.equals("DELIVERED")
                || orderStatus.equals("PENDING")
                || orderStatus.equals("COMPLETED")) {
            order.setOrderStatus(orderStatus);
            orderRepository.save(order);
            return order;
        }
        throw new ResourceNotFoundException("Order not found");
    }

    @Override
    public void cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);
        orderRepository.delete(order);

    }

    @Override
    public List<Order> getUsersOrder(Long userId) {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        if (orderStatus != null && !orderStatus.isEmpty()) {
            orders = orders.stream()
                    .filter(order -> order.getOrderStatus().equalsIgnoreCase(orderStatus))
                    .toList();
        }
        return orders;
    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
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
