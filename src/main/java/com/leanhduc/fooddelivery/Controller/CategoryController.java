package com.leanhduc.fooddelivery.Controller;


import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Service.Category.ICategoryService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping ("")
public class CategoryController {
    private final ICategoryService categoryService;
    private final IUserService userService;

    @GetMapping ("/category/restaurant/{id}")
    public ResponseEntity<List<Category>> getRestaurantCategory(
            @PathVariable Long id) {
        List<Category> categories = categoryService.findCategoriesByRestaurantId(id);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
