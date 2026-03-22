package com.kiranabazaar.service;

import java.util.ArrayList;
import java.util.Optional;

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
	
	//Add to Cart
	public Cart addToCart(Long userId, Long productId, int quantity) {
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Cart cart = cartRepository.findByUser(user)
				.orElseGet(() -> {
					Cart newCart = new Cart();
					newCart.setUser(user);
					newCart.setItems(new ArrayList<>());
					return cartRepository.save(newCart);
				});
		
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Check if product already exists in cart
		Optional<CartItem> existingItem = cart.getItems().stream()
				.filter(item -> item.getProduct().getId().equals(productId))
				.findFirst();
		
		if(existingItem.isPresent()) {
			//update quantity
			CartItem item = existingItem.get();
			item.setQuantity(item.getQuantity() + quantity);
		}
		else {
		
		// create new item
		CartItem item = new CartItem();
		item.setCart(cart);
		item.setProduct(product);
		item.setQuantity(quantity);
		cart.getItems().add(item);
		}
		return cartRepository.save(cart);
	
	}
	
	//Get Cart
	public Cart getCart(Long userId) {
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		return cartRepository.findByUser(user)
				.orElseThrow(() -> new RuntimeException("Cart not found")); 
	}
	
	//Remove Item from the Cart
	public Cart removeItem(Long itemId)
	{
		
		CartItem item = cartItemRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Item not found"));

		Cart cart = item.getCart();
		
		cart.getItems().remove(item);
		cartItemRepository.delete(item);
		
		return cart;
	}
	
	//Update Quantity
	public Cart updateQuantity(Long itemId, int quantity) {
		
		CartItem item = cartItemRepository.findById(itemId)
				.orElseThrow(() -> new RuntimeException("Item not found"));

		item.setQuantity(quantity);
		
		cartItemRepository.save(item);
		
		return item.getCart();
	}
}
