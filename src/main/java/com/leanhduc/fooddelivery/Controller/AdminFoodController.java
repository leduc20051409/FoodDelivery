package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Food;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.RequestDto.FoodRequest;
import com.leanhduc.fooddelivery.Response.MessageResponse;
import com.leanhduc.fooddelivery.Service.Food.IFoodService;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/food")
public class AdminFoodController {
    private final IFoodService foodService;
    private final IUserService userService;
    private final IRestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody FoodRequest food,
                                           @RequestHeader("Authorization") String jwtToken) {
        userService.findByJwtToken(jwtToken);
        Restaurant restaurant = restaurantService.getRestaurantById(food.getRestaurantId());
        Food createdFood = foodService.createFood(food, food.getCategory(), restaurant);
        return new ResponseEntity<>(createdFood, HttpStatus.CREATED);
    }

    @DeleteMapping("/{foodId}/delete")
    public ResponseEntity<MessageResponse> deleteFood(@PathVariable Long foodId,
                                                                   @RequestHeader("Authorization") String jwtToken) {
        userService.findByJwtToken(jwtToken);
        foodService.deleteFood(foodId);
        return new ResponseEntity<>(new MessageResponse("delete food successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{foodId}/update")
    public ResponseEntity<Food> updateAvailabilityStatus(@PathVariable Long foodId,
                                                      @RequestHeader("Authorization") String jwtToken) throws Exception {
        userService.findByJwtToken(jwtToken);
        Food food = foodService.updateAvailabilityStatus(foodId);
        return new ResponseEntity<>(food, HttpStatus.CREATED);
    }
}
