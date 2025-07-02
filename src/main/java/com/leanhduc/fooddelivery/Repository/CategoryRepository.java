package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByRestaurantId(Long restaurantId);
}
