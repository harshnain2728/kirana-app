// src/main/java/com/kiranabazaar/controller/CartController.java

package com.kiranabazaar.controller;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Cart;
import com.kiranabazaar.service.CartService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    // Logger declared at class level — one per class, static final
    private static final Logger log = LogManager.getLogger(CartController.class);

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add to Cart
    // If userId/productId not found → CartService throws ResourceNotFoundException
    // → GlobalExceptionHandler catches → returns HTTP 404 JSON automatically
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        log.info("POST /api/cart/add — userId={}, productId={}, quantity={}", userId, productId, quantity);
        Cart cart = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Product added to cart", cart));
    }

    // Get Cart
    @GetMapping
    public ResponseEntity<ApiResponse> getCart(@RequestParam Long userId) {

        log.debug("GET /api/cart — userId={}", userId);
        Cart cart = cartService.getCart(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Cart fetched successfully", cart));
    }

    // Remove Item
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<ApiResponse> removeItem(@PathVariable Long itemId) {

        log.info("DELETE /api/cart/remove/{}", itemId);
        Cart cart = cartService.removeItem(itemId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed successfully", cart));
    }

    // Update Quantity
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateCart(
            @RequestParam Long itemId,
            @RequestParam int quantity) {

        log.info("PUT /api/cart/update — itemId={}, quantity={}", itemId, quantity);
        Cart cart = cartService.updateQuantity(itemId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Cart updated successfully", cart));
    }
}