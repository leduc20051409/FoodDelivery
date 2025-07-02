package com.leanhduc.fooddelivery.Service.Ingredient;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.IngredientCategory;
import com.leanhduc.fooddelivery.Model.IngredientItems;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Repository.IngredientCategoryRepository;
import com.leanhduc.fooddelivery.Repository.IngredientItemsRepository;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IngredientService implements IIIngredientService{
    private final IngredientCategoryRepository ingredientCategoryRepository;
    private final IngredientItemsRepository ingredientItemsRepository;
    private final IRestaurantService restaurantService;

    @Override
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        IngredientCategory ingredientCategory = new IngredientCategory();
        ingredientCategory.setName(name);
        ingredientCategory.setRestaurant(restaurant);
        return ingredientCategoryRepository.save(ingredientCategory);
    }

    @Override
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception {
        return ingredientCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient category not found"));
    }

    @Override
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception {
        restaurantService.getRestaurantById(id);
        return ingredientCategoryRepository.findByRestaurantId(id);
    }

    @Override
    public IngredientItems createIngredientItem(Long restaurantId, String ingredientName, Long categoryId) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        IngredientCategory ingredientCategory = findIngredientCategoryById(categoryId);

        IngredientItems item = new IngredientItems();
        item.setName(ingredientName);
        item.setRestaurant(restaurant);
        item.setCategory(ingredientCategory);

        IngredientItems savedItem = ingredientItemsRepository.save(item);
        ingredientCategory.getIngredients().add(savedItem);
        return savedItem;
    }

    @Override
    public List<IngredientItems> findRestaurantsIngredients(Long restaurantId) {
        return ingredientItemsRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public IngredientItems updateStock(Long id) {
        Optional<IngredientItems> optionalItem = Optional.ofNullable(ingredientItemsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient item not found")));
        IngredientItems item = optionalItem.get();
        item.setStoke(!item.isStoke());
        return ingredientItemsRepository.save(item);
    }
}
