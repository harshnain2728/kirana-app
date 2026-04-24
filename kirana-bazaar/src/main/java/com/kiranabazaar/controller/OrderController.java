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

    // ── Place Order ──
    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> orderRequest) {
        try {
            Order order = orderService.placeOrder(userId, orderRequest);
            return ResponseEntity.ok(
                new ApiResponse(true, "Order placed successfully", order));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ✅ Get My Orders
    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyOrders(
            @RequestParam Long userId) {
        try {
            List<Order> orders = orderService.getOrdersByUser(userId);
            return ResponseEntity.ok(
                new ApiResponse(true, "Orders fetched", orders));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Get All Orders (Admin) ──
    @GetMapping
    public ResponseEntity<ApiResponse> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(
                new ApiResponse(true, "All orders fetched", orders));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // ── Update Order Status (Admin) ──
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Order order = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(
                new ApiResponse(true, "Status updated", order));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                .body(new ApiResponse(false, e.getMessage()));
        }
    }
}