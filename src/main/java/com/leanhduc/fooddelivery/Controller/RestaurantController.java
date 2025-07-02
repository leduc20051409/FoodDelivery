package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.ResponseDto.RestaurantDto;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class RestaurantController {
    private final IRestaurantService restaurantService;
    private final IUserService userService;

    @GetMapping("/restaurants/restaurant/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }

    @GetMapping("/restaurants/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestParam String keyword) {
        List<Restaurant> restaurants = restaurantService.searchRestaurant(keyword);
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @GetMapping("/restaurants/all")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return new ResponseEntity<>(restaurants, HttpStatus.OK);
    }

    @PutMapping("/api/restaurants/restaurant/{id}/add-favourites")
    public ResponseEntity<RestaurantDto> addToFavourite(@PathVariable Long id,
                                                     @RequestHeader("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        RestaurantDto restaurantDto = restaurantService.addToFavorites(id, user);
        return new ResponseEntity<>(restaurantDto, HttpStatus.OK);
    }
}
