package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
