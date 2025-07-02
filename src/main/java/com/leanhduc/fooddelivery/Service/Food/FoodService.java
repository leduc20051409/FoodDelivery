package com.leanhduc.fooddelivery.Service.Food;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.Food;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Repository.FoodRepository;
import com.leanhduc.fooddelivery.RequestDto.FoodRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodService implements IFoodService {
    private final FoodRepository foodRepository;

    @Override
    public Food createFood(FoodRequest food, Category category, Restaurant restaurant) {
        Food newFood = new Food();
        newFood.setCategory(category);
        newFood.setRestaurant(restaurant);
        newFood.setDescription(food.getDescription());
        newFood.setImages(food.getImages());
        newFood.setName(food.getName());
        newFood.setPrice(food.getPrice());
        newFood.setIngredientItems(food.getIngredientItems());
        newFood.setVegetarian(food.isVegetarian());
        newFood.setSeasonal(food.isSeasonal());

        Food saveFood = foodRepository.save(newFood);
        restaurant.getFoods().add(saveFood);
        return saveFood;
    }

    @Override
    public void deleteFood(Long foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found with id: " + foodId));
        food.setRestaurant(null);
        foodRepository.save(food);
    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId, boolean isVegetarian, boolean isNonVegetarian, boolean isSeasonal, String foodCategory) {

        List<Food> foods = foodRepository.findByRestaurantId(restaurantId);
        if (isVegetarian) {
            foods = filterByVegetarian(foods, isVegetarian);
        }
        if (isNonVegetarian) {
            foods = filterByNonVegetarian(foods, isNonVegetarian);
        }
        if (isSeasonal) {
            foods = filterBySeasonal(foods, isSeasonal);
        }
        if (foodCategory != null && !foodCategory.isEmpty()) {
            foods = filterByCategory(foods, foodCategory);
        }
        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            if (food.getCategory() != null) {
                return food.getCategory().getName().equalsIgnoreCase(foodCategory);
            }
            return false;
        }).collect(Collectors.toList());
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
        return foods.stream()
                .filter(food -> food.isSeasonal() == isSeasonal)
                .collect(Collectors.toList());
    }

    private List<Food> filterByNonVegetarian(List<Food> foods, boolean isNonVegetarian) {
        return foods.stream()
                .filter(food -> food.isVegetarian() != isNonVegetarian)
                .collect(Collectors.toList());
    }

    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {
        return foods.stream()
                .filter(food -> food.isVegetarian() == isVegetarian)
                .collect(Collectors.toList());
    }

    @Override
    public List<Food> searchFood(String keyword, Long restaurantId) {
        if (restaurantId != null) {
            return foodRepository.searchFoodInRestaurant(keyword, restaurantId);
        }
        return foodRepository.searchFood(keyword);
    }


    @Override
    public Food findFoodById(Long foodId) throws Exception {
        return foodRepository.findById(foodId)
                .orElseThrow(() -> new ResourceNotFoundException("Food not found with id: " + foodId));
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        if (food != null) {
            food.setAvailable(!food.isAvailable());
            return foodRepository.save(food);
        }
        return null;
    }
}
