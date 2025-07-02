package com.leanhduc.fooddelivery.Controller;

import com.leanhduc.fooddelivery.Model.Cart;
import com.leanhduc.fooddelivery.Model.CartItem;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.RequestDto.CartItemRequest;
import com.leanhduc.fooddelivery.RequestDto.UpdateCartItemRequest;
import com.leanhduc.fooddelivery.Service.Cart.ICartService;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final ICartService cartService;
    private final IUserService userService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addItemToCart(@RequestBody CartItemRequest cartItem,
                                                  @RequestHeader("Authorization") String jwt) {
        try {
            CartItem addedItem = cartService.addItemToCart(cartItem, jwt);
            return new ResponseEntity<>(addedItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/cart-item/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(
            @RequestBody UpdateCartItemRequest request,
            @RequestHeader("Authorization") String jwt) {
        try {
            CartItem updatedItem = cartService.updateCartItemQuantity(request.getCartItemId(), request.getQuantity());
            return new ResponseEntity<>(updatedItem, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/cart-item/{cartItemId}/remove")
    public ResponseEntity<Cart> removeItemFromCart(
            @PathVariable Long cartItemId,
            @RequestHeader("Authorization") String jwt) {
        try {
            Cart cart = cartService.removeItemFromCart(cartItemId, jwt);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/clear")
    public ResponseEntity<Cart> clearCart(@RequestHeader("Authorization") String jwt) {
        try {
            Cart cart = cartService.clearCart(jwt);
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping()
    public ResponseEntity<Cart> findUserCart(
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findByJwtToken(jwt);
            Cart cart = cartService.findCartByUserId(user.getId());
            return new ResponseEntity<>(cart, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItem>> findCartItemsByUserId(
            @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findByJwtToken(jwt);
            List<CartItem> cartItems = cartService.findCartItemsByUserId(user.getId());
            return new ResponseEntity<>(cartItems, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
