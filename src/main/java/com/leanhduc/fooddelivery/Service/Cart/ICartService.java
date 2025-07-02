package com.leanhduc.fooddelivery.Service.Cart;

import com.leanhduc.fooddelivery.Model.Cart;
import com.leanhduc.fooddelivery.Model.CartItem;
import com.leanhduc.fooddelivery.RequestDto.CartItemRequest;

import java.util.List;

public interface ICartService {
    CartItem addItemToCart(CartItemRequest req, String jwt) throws Exception;

    CartItem updateCartItemQuantity(Long cartItemId, int quantity);

    Cart removeItemFromCart(Long cartItemId, String jwt);

    Long calculateCartTotals(Cart cart) ;

    Cart findCartById(Long id);

    Cart findCartByUserId(Long userId) throws Exception;

    List<CartItem> findCartItemsByUserId(Long userId);

    Cart clearCart(String jwtToken) throws Exception;

}
