package com.leanhduc.fooddelivery.Service.Cart;

import com.leanhduc.fooddelivery.Exception.ResourceNotFoundException;
import com.leanhduc.fooddelivery.Model.Cart;
import com.leanhduc.fooddelivery.Model.CartItem;
import com.leanhduc.fooddelivery.Model.Food;
import com.leanhduc.fooddelivery.Model.User;
import com.leanhduc.fooddelivery.Repository.CartItemRepository;
import com.leanhduc.fooddelivery.Repository.CartRepository;
import com.leanhduc.fooddelivery.Repository.FoodRepository;
import com.leanhduc.fooddelivery.RequestDto.CartItemRequest;
import com.leanhduc.fooddelivery.Service.User.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
    private final CartRepository cartRepository;
    private final IUserService userService;
    private final FoodRepository foodRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem addItemToCart(CartItemRequest req, String jwt) throws Exception {
        User user = userService.findByJwtToken(jwt);
        Food food = foodRepository.findById(req.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
        Cart cart = cartRepository.findByCustomerId(user.getId());
        for (CartItem cartItem : cart.getItems()) {
            if (cartItem.getFood().equals(food)) {
                int quantity = cartItem.getQuantity() + req.getQuantity();
                return updateCartItemQuantity(cartItem.getId(), quantity);
            }
        }
        CartItem cartItem = new CartItem();
        cartItem.setFood(food);
        cartItem.setQuantity(req.getQuantity());
        cartItem.setIngredients(req.getIngredients());
        cartItem.setCart(cart);
        cartItem.setPrice(food.getPrice() * req.getQuantity());

        CartItem savedCartItem = cartItemRepository.save(cartItem);
        cart.getItems().add(savedCartItem);
        return savedCartItem;
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cartItem.setQuantity(quantity);
        cartItem.setPrice(cartItem.getFood().getPrice() * quantity);
        return cartItemRepository.save(cartItem);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) {
        User user = userService.findByJwtToken(jwt);
        Cart cart = cartRepository.findByCustomerId(user.getId());
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        cart.getItems().remove(cartItem);

        return cartRepository.save(cart);
    }


    @Override
    public Long calculateCartTotals(Cart cart) {
        long total = 0L;
        for (CartItem cartItem : cart.getItems()) {
            total += cartItem.getFood().getPrice() * cartItem.getQuantity();
        }
        return total;
    }

    @Override
    public Cart findCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
        Cart cart = cartRepository.findByCustomerId(userId);
        cart.setTotal(calculateCartTotals(cart));
        return cart;
    }

    @Override
    public List<CartItem> findCartItemsByUserId(Long userId) {
        Cart cart = cartRepository.findCartByCustomerId(userId).orElseThrow(
                () -> new ResourceNotFoundException("Cart not found for user with ID: " + userId));
        if (cart.getItems() == null) {
            throw new ResourceNotFoundException("Cart items not found for user with ID: " + userId);
        }
        return cart.getItems();
    }

    @Override
    public Cart clearCart(String jwtToken) throws Exception {
        User user = userService.findByJwtToken(jwtToken);
        Cart cart = findCartByUserId(user.getId());
        cart.getItems().clear();
        return cartRepository.save(cart);

    }
}
