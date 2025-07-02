package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);
}
