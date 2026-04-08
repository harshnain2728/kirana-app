package com.kiranabazaar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Order;
import com.kiranabazaar.service.OrderService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> orderRequest) {  // ← accept frontend cart
        try {
            System.out.println("Order Error: userId=" + userId);
            System.out.println("Order Request: " + orderRequest);
            Order order = orderService.placeOrder(userId, orderRequest);
            return ResponseEntity.ok(
                new ApiResponse(true, "Order placed successfully", order)
            );
        } catch (RuntimeException e) {
            System.out.println("Order Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}