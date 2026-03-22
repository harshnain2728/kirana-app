package com.kiranabazaar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Order;
import com.kiranabazaar.service.OrderService;

@RestController
@RequestMapping("api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
	
	private final OrderService orderService;
	
	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}
	
	// Place Order API
	@PostMapping
	public ResponseEntity<ApiResponse> placeOrder(@RequestParam Long userId) {
		
		try {
			Order order = orderService.placeOrder(userId);
			
			return ResponseEntity.ok(
					new ApiResponse(true, "Order placed successfully",order)
			);
		}
		catch (RuntimeException e) {
			
			return ResponseEntity.status(400)
					.body(new ApiResponse(false, e.getMessage()));
		}
	}

}
