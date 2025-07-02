package com.leanhduc.fooddelivery.Service.Category;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.Restaurant;
import com.leanhduc.fooddelivery.Repository.CategoryRepository;
import com.leanhduc.fooddelivery.Service.Restaurant.IRestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;
    private final IRestaurantService restaurantService;

    @Override
    public Category createCategory(String name, Long userId) {
        Restaurant restaurant = restaurantService.getRestaurantByUserId(userId);
        Category category = new Category();
        category.setName(name);
        category.setRestaurant(restaurant);
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> findCategoriesByRestaurantId(Long id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return categoryRepository.findByRestaurantId(id);
    }

    @Override
    public Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
