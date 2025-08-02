package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantId(Long restaurantId);
    Page<Review> findByRestaurantId(Long restaurantId, Pageable pageable);
    Page<Review> findByCustomerId(Long customerId, Pageable pageable);

    Optional<Review> findByOrderIdAndCustomerId(Long orderId, Long userId);
}
