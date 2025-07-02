package com.leanhduc.fooddelivery.Repository;

import com.leanhduc.fooddelivery.Model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByRestaurantId(Long restaurantId);

    @Query("SELECT f FROM Food f WHERE " +
            "LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(f.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Food> searchFood(@Param ("keyword") String keyword);

    @Query("SELECT f FROM Food f WHERE f.restaurant.id = :restaurantId AND " +
            "(LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(f.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Food> searchFoodInRestaurant(@Param("keyword") String keyword,
                                      @Param("restaurantId") Long restaurantId);
}
