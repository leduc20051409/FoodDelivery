package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Order;
import com.leanhduc.fooddelivery.Model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long userId);
    List<Order> findByRestaurantId(Long restaurantId);

    @Query("SELECT o FROM Order o WHERE " +
            "(:id IS NULL OR o.id = :id) AND " +
            "(:minPrice IS NULL OR o.totalPrice >= :minPrice) AND " +
            "(:maxPrice IS NULL OR o.totalPrice <= :maxPrice) AND " +
            "(:customerId IS NULL OR o.customer.id = :customerId) AND " +
            "(:status IS NULL OR o.orderStatus = :status)")
    List<Order> searchOrders(
            Long id,
            Long minPrice,
            Long maxPrice,
            Long customerId,
            OrderStatus status
    );
}
