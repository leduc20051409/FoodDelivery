package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByCustomerId(Long userId);
    Optional<Cart> findCartByCustomerId(Long id);

}
