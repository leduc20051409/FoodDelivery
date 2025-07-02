package com.leanhduc.fooddelivery.Service.Category;

import com.leanhduc.fooddelivery.Model.Category;

import java.util.List;

public interface ICategoryService {

    Category createCategory(String name, Long userId);
    List<Category> findCategoriesByRestaurantId(Long id);
    Category findCategoryById(Long id);
}
