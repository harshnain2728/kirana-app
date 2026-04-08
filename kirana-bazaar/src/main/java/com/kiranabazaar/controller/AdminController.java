package com.kiranabazaar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kiranabazaar.entity.Order;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.service.OrderService;
import com.kiranabazaar.service.ProductService;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private ProductService productService;
	
	// 1. View all orders
	@GetMapping("/orders")
	public ResponseEntity<List<Order>> getAllOrders(){
		return ResponseEntity.ok(orderService.getAllOrders());
	}
	
	// 2. update order status
	@PutMapping("/orders/{id}/status")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Order> updateOrderStatus(
			@PathVariable Long id,
			@RequestParam String status){
		return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
	}
	
	// 3. Update stock
	@PutMapping("/products/{id}/stock")
	public ResponseEntity<Product> updateStock(
			@PathVariable Long id,
			@RequestParam int quantity){
		return ResponseEntity.ok(productService.updateStock(id, quantity));
	}
	
	// 4. Low stock
	@GetMapping("/products/low-stock")
	public ResponseEntity<List<Product>> getLowStockProducts() {
		return ResponseEntity.ok(productService.getLowStockProducts());
	}
}
