package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Food;
import com.leanhduc.fooddelivery.Service.Food.IFoodService;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/food")
public class FoodController {
    private final IFoodService foodService;
    private final IUserService userService;
    private final IRestaurantService restaurantService;

    @GetMapping ("/search")
    public ResponseEntity<List<Food>> searchFood(
            @RequestParam (required = false) String keyword,
            @RequestParam (required = false) Long restaurantId) {
        List<Food> foods = foodService.searchFood(keyword, restaurantId);
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }

    @GetMapping ("/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(
            @PathVariable Long restaurantId,
            @RequestParam (required = false) boolean isVegetarian,
            @RequestParam (required = false) boolean isNonVegetarian,
            @RequestParam (required = false) boolean isSeasonal,
            @RequestParam (required = false) String foodCategory) {
        //userService.findByJwtToken(jwtToken);
        List<Food> foods = foodService.getRestaurantsFood(restaurantId, isVegetarian, isNonVegetarian, isSeasonal, foodCategory);

        return new ResponseEntity<>(foods, HttpStatus.OK);
    }
}
