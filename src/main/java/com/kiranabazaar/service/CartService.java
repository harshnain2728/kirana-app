// src/main/java/com/kiranabazaar/service/CartService.java

package com.kiranabazaar.service;

import java.util.ArrayList;
import java.util.Optional;

import com.kiranabazaar.exception.BadRequestException;
import com.kiranabazaar.exception.ResourceNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.Cart;
import com.kiranabazaar.entity.CartItem;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.CartItemRepository;
import com.kiranabazaar.repository.CartRepository;
import com.kiranabazaar.repository.ProductRepository;
import com.kiranabazaar.repository.UserRepository;

@Service
public class CartService {

    // Log4j2 native logger — writes to Console + logs/app.log per log4j2-spring.xml
    private static final Logger log = LogManager.getLogger(CartService.class);

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // ─── Add to Cart ──────────────────────────────────────────────────
    public Cart addToCart(Long userId, Long productId, int quantity) {

        log.info("addToCart called: userId={}, productId={}, quantity={}", userId, productId, quantity);

        // ResourceNotFoundException → GlobalHandler returns HTTP 404
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found: userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        // Fetch or create cart for this user
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    log.info("No cart found for userId={} — creating new cart", userId);
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.warn("Product not found: productId={}", productId);
                    return new ResourceNotFoundException("Product not found with id: " + productId);
                });

        // Stock validation — BadRequestException → GlobalHandler returns HTTP 400
        // Without this check, user could add more than available stock
        if (product.getStock() < quantity) {
            log.warn("Insufficient stock: productId={}, requested={}, available={}",
                     productId, quantity, product.getStock());
            throw new BadRequestException(
                "Insufficient stock for '" + product.getName() + 
                "'. Available: " + product.getStock()
            );
        }

        // If product already in cart → update quantity, don't add duplicate
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + quantity;
            log.info("Product already in cart — updating quantity: productId={}, oldQty={}, newQty={}",
                     productId, item.getQuantity(), newQty);
            item.setQuantity(newQty);
        } else {
            log.info("Adding new item to cart: productId={}, quantity={}", productId, quantity);
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        Cart saved = cartRepository.save(cart);
        log.info("Cart saved: cartId={}, totalItems={}", saved.getId(), saved.getItems().size());
        return saved;
    }

    // ─── Get Cart ─────────────────────────────────────────────────────
    public Cart getCart(Long userId) {

        log.debug("getCart called: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found: userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> {
                    // warn (not error) — cart simply doesn't exist yet, not a crash
                    log.warn("Cart not found for userId={}", userId);
                    return new ResourceNotFoundException("Cart not found for userId: " + userId);
                });

        log.info("Cart fetched: userId={}, cartId={}, items={}", userId, cart.getId(), cart.getItems().size());
        return cart;
    }

    // ─── Remove Item ──────────────────────────────────────────────────
    public Cart removeItem(Long itemId) {

        log.info("removeItem called: itemId={}", itemId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> {
                    log.warn("CartItem not found: itemId={}", itemId);
                    return new ResourceNotFoundException("Cart item not found with id: " + itemId);
                });

        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        log.info("Item removed: itemId={}, cartId={}, remainingItems={}", 
                 itemId, cart.getId(), cart.getItems().size());
        return cart;
    }

    // ─── Update Quantity ──────────────────────────────────────────────
    public Cart updateQuantity(Long itemId, int quantity) {

        log.info("updateQuantity called: itemId={}, newQuantity={}", itemId, quantity);

        // Quantity must be at least 1 — BadRequestException → HTTP 400
        if (quantity < 1) {
            log.warn("Invalid quantity update: itemId={}, quantity={}", itemId, quantity);
            throw new BadRequestException("Quantity must be at least 1. Use remove to delete item.");
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> {
                    log.warn("CartItem not found: itemId={}", itemId);
                    return new ResourceNotFoundException("Cart item not found with id: " + itemId);
                });

        // Check stock before updating
        if (item.getProduct().getStock() < quantity) {
            log.warn("Stock check failed on quantity update: productId={}, requested={}, available={}",
                     item.getProduct().getId(), quantity, item.getProduct().getStock());
            throw new BadRequestException(
                "Only " + item.getProduct().getStock() + " units available for '" + 
                item.getProduct().getName() + "'"
            );
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        log.info("Quantity updated: itemId={}, quantity={}", itemId, quantity);
        return item.getCart();
    }
}