// src/main/java/com/kiranabazaar/controller/OrderController.java

package com.kiranabazaar.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

    private static final Logger log = LogManager.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Place Order
    // If user/product not found → ResourceNotFoundException → GlobalHandler → 404
    // If out of stock → BadRequestException → GlobalHandler → 400
    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(
            @RequestParam Long userId,
            @RequestBody Map<String, Object> orderRequest) {

        log.info("POST api/orders — userId={}", userId);
        Order order = orderService.placeOrder(userId, orderRequest);
        log.info("Order placed: orderId={}", order.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully", order));
    }

    // Get My Orders
    @GetMapping("/my")
    public ResponseEntity<ApiResponse> getMyOrders(@RequestParam Long userId) {

        log.debug("GET api/orders/my — userId={}", userId);
        List<Order> orders = orderService.getOrdersByUserId(userId); // ✅ FIXED: was getOrdersByUser(userId)
        return ResponseEntity.ok(new ApiResponse(true, "Orders fetched", orders));
    }

    // Get All Orders (Admin)
    @GetMapping
    public ResponseEntity<ApiResponse> getAllOrders() {

        log.debug("GET api/orders (admin)");
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ApiResponse(true, "All orders fetched", orders));
    }

    // Update Order Status (Admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        log.info("PUT api/orders/{}/status — newStatus={}", id, status);
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Status updated", order));
    }

    // Get Single Order
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Long id) {

        log.debug("GET api/orders/{}", id);
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched", order));
    }
}