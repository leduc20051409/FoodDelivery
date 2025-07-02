package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Category;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Service.Category.ICategoryService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping ("/api")
public class AdminCategoryController {
    private final ICategoryService categoryService;
    private final IUserService userService;

    @PostMapping ("/admin/category")
    public ResponseEntity<Category> createCategory(@RequestBody Category category,
                                               @RequestHeader ("Authorization") String jwtToken) {
        User user = userService.findByJwtToken(jwtToken);
        Category createdCategory = categoryService.createCategory(category.getName(), user.getId());
        return new ResponseEntity<>(createdCategory, HttpStatus.OK);
    }





}
