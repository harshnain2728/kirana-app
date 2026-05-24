// src/main/java/com/kiranabazaar/controller/ProductController.java

package com.kiranabazaar.controller;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.service.ProductService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private static final Logger log = LogManager.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // No try-catch needed — if service throws ResourceNotFoundException,
    // GlobalExceptionHandler intercepts and returns 404 automatically
    @PostMapping
    public ResponseEntity<ApiResponse> addProduct(@RequestBody Product product) {
        log.info("POST /api/products - Adding product: {}", product.getName());
        Product saved = productService.addProduct(product);
        return ResponseEntity.ok(new ApiResponse(true, "Product added successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        log.debug("GET /api/products");
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched successfully", products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id) {
        log.debug("GET /api/products/{}", id);
        Product product = productService.getProductById(id); // throws ResourceNotFoundException if not found
        return ResponseEntity.ok(new ApiResponse(true, "Product fetched successfully", product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long id,
                                                      @RequestBody Product product) {
        log.info("PUT /api/products/{}", id);
        Product updated = productService.updateProduct(id, product);
        return ResponseEntity.ok(new ApiResponse(true, "Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        log.info("DELETE /api/products/{}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
    }

    @GetMapping("/browse")
    public ResponseEntity<ApiResponse> browseProducts(@RequestParam(required = false) String keyword,
                                                       Pageable pageable) {
        log.debug("GET /api/products/browse - keyword={}", keyword);
        Page<Product> page = productService.getProducts(keyword, pageable);
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched successfully", page));
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<ApiResponse> getProductStock(@PathVariable Long id) {
        log.debug("GET /api/products/{}/stock", id);
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Stock fetched successfully", product.getStock()));
    }
}