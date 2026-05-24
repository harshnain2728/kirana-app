// src/main/java/com/kiranabazaar/controller/AdminController.java

package com.kiranabazaar.controller;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Order;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.service.OrderService;
import com.kiranabazaar.service.ProductService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger log = LogManager.getLogger(AdminController.class);

    // Constructor injection — not @Autowired field injection
    // Why: constructor injection is testable, avoids NPE on null fields, Spring-recommended
    private final OrderService orderService;
    private final ProductService productService;

    public AdminController(OrderService orderService, ProductService productService) {
        this.orderService = orderService;
        this.productService = productService;
    }

    // 1. View all orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse> getAllOrders() {
        log.info("Admin: GET /api/admin/orders");
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ApiResponse(true, "All orders fetched", orders));
    }

    // 2. Update order status
    @PutMapping("/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        log.info("Admin: PUT /api/admin/orders/{}/status — status={}", id, status);
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Order status updated", order));
    }

    // 3. Update stock
    @PutMapping("/products/{id}/stock")
    public ResponseEntity<ApiResponse> updateStock(
            @PathVariable Long id,
            @RequestParam int quantity) {

        log.info("Admin: PUT /api/admin/products/{}/stock — quantity={}", id, quantity);
        Product product = productService.updateStock(id, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Stock updated", product));
    }

    // 4. Low stock alert
    @GetMapping("/products/low-stock")
    public ResponseEntity<ApiResponse> getLowStockProducts() {
        log.info("Admin: GET /api/admin/products/low-stock");
        List<Product> products = productService.getLowStockProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Low stock products fetched", products));
    }
}