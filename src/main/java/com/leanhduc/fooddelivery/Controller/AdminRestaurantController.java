package com.leanhduc.fooddelivery.Controller;


import com.leanhduc.fooddelivery.Exception.AlreadyExistsException;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.RestaurantRequest;
import com.leanhduc.fooddelivery.Response.APIResponse;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {
    private final IRestaurantService restaurantService;
    private final IUserService userService;

    @PostMapping("/create")
    public ResponseEntity<Restaurant> createRestaurant(
            @RequestBody RestaurantRequest request,
            @RequestHeader("Authorization") String jwtToken) throws AlreadyExistsException {

        User user = userService.findByJwtToken(jwtToken);
        Restaurant restaurant = restaurantService.createRestaurant(request, user);
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED);
    }

    @PutMapping("/restaurant/{id}/update")
    public ResponseEntity<Restaurant> updateRestaurant(
            @RequestBody RestaurantRequest request,
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long id) {

        userService.findByJwtToken(jwtToken);
        Restaurant restaurant = restaurantService.updateRestaurant(id, request);
        return new ResponseEntity<>(restaurant, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/restaurant/{id}/delete")
    public ResponseEntity<APIResponse> deleteRestaurant(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long id) {

        userService.findByJwtToken(jwtToken);
        restaurantService.deleteRestaurant(id);
        return new ResponseEntity<>(new APIResponse(id, "delete success"), HttpStatus.ACCEPTED);
    }

    @PutMapping("/restaurant/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long id) {

        userService.findByJwtToken(jwtToken);
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id);
        return new ResponseEntity<>(restaurant, HttpStatus.ACCEPTED);
    }

    @GetMapping("/restaurant/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId(
            @RequestHeader("Authorization") String jwtToken) {

        User user = userService.findByJwtToken(jwtToken);
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId());
        return new ResponseEntity<>(restaurant, HttpStatus.OK);
    }
}
