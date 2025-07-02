package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.IngredientItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientItemsRepository extends JpaRepository<IngredientItems, Long> {
    List<IngredientItems> findByRestaurantId(Long restaurantId);
}
