package com.kiranabazaar.controller;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Cart;
import com.kiranabazaar.repository.CartItemRepository;
import com.kiranabazaar.service.CartService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins ="*")
public class CartController {
	
	private final CartService cartService;
	
	public CartController(CartService cartService) {
		this.cartService = cartService;
	}
	
	//Add to Cart
	@PostMapping("/add")
	public ResponseEntity<ApiResponse> addToCart(
			@RequestParam Long userId,
			@RequestParam Long productId,
			@RequestParam int quantity) {
		
		Cart cart = cartService.addToCart(userId, productId, quantity);
		
		return ResponseEntity.ok(
				new ApiResponse(true,"Product added to cart", cart)
				);
	}
	
	//Get Cart
	@GetMapping
	public ResponseEntity<ApiResponse> getCart(@RequestParam Long userId)  {
		
		Cart cart = cartService.getCart(userId);
		
		return ResponseEntity.ok(
				new ApiResponse(true,"Cart fetched successfully",cart)
				);
	}
	
	// Remove item 
	@DeleteMapping("/remove/{itemId}")
	public ResponseEntity<ApiResponse> removeItem(@PathVariable Long itemId){
		
		Cart cart = cartService.removeItem(itemId);
		
		return ResponseEntity.ok(
				new ApiResponse(true,"Item removed successfully", cart));
	}
	
	//Update item
	@PutMapping("/update")
	public ResponseEntity<ApiResponse> updateCart(
			@RequestParam Long itemId, @RequestParam int quantity) {
		
		Cart cart = cartService.updateQuantity(itemId, quantity);
		
		return ResponseEntity.ok(
				new ApiResponse(true, "Cart updated successfully", cart));
	}
	

}
