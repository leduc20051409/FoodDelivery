package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.IngredientCategory;
import com.leanhduc.fooddelivery.Model.IngredientItems;
import com.leanhduc.fooddelivery.RequestDto.IngredientCategoryRequest;
import com.leanhduc.fooddelivery.RequestDto.IngredientRequest;
import com.leanhduc.fooddelivery.Service.Ingredient.IIIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/ingredients")
public class AdminIngredientController {
    private final IIIngredientService ingredientService;

    @PostMapping ("/category")
    public ResponseEntity<IngredientCategory> createIngredientCategory(@RequestBody IngredientCategoryRequest request) {
        try {
            IngredientCategory ingredientCategory = ingredientService
                    .createIngredientCategory(request.getName(), request.getRestaurantId());
            return new ResponseEntity<>(ingredientCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping ()
    public ResponseEntity<IngredientItems> createIngredientItem(@RequestBody IngredientRequest request) {
        try {
            IngredientItems item = ingredientService
                    .createIngredientItem(request.getRestaurantId(), request.getName(), request.getCategoryId());
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping ("/{id}/stock")
    public ResponseEntity<IngredientItems> updateIngredientStock(@PathVariable Long id) {
        try {
            IngredientItems ingredientItem = ingredientService.updateStock(id);
            return new ResponseEntity<>(ingredientItem, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<IngredientItems>> getRestaurantIngredient(@PathVariable Long id) {
        try {
            List<IngredientItems> ingredientItems = ingredientService.findRestaurantsIngredients(id);
            return new ResponseEntity<>(ingredientItems, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/restaurant/{id}/category")
    public ResponseEntity<List<IngredientCategory>> getRestaurantIngredientCategory(@PathVariable Long id) {
        try {
            List<IngredientCategory> category = ingredientService.findIngredientCategoryByRestaurantId(id);
            return new ResponseEntity<>(category, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
