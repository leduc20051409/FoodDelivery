package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
