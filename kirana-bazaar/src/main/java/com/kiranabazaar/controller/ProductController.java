package com.kiranabazaar.controller;

import org.springframework.data.domain.Pageable;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // =========================
    // Add Product
    // =========================

    @PostMapping
    public ResponseEntity<ApiResponse> addProduct(
            @RequestBody Product product) {

        Product savedProduct =
                productService.addProduct(product);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Product added successfully",
                        savedProduct
                )
        );
    }

    // =========================
    // Get All Products
    // =========================

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {

        List<Product> products =
                productService.getAllProducts();

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Products fetched successfully",
                        products
                )
        );
    }

    // =========================
    // Get Product By Id
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(
            @PathVariable Long id) {

        try {

            Product product =
                    productService.getProductById(id);

            return ResponseEntity.ok(
                    new ApiResponse(
                            true,
                            "Product fetched successfully",
                            product
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            new ApiResponse(
                                    false,
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================
    // Update Product
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        try {

            Product updatedProduct =
                    productService.updateProduct(id, product);

            return ResponseEntity.ok(
                    new ApiResponse(
                            true,
                            "Product updated successfully",
                            updatedProduct
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            new ApiResponse(
                                    false,
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================
    // Delete Product
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(
            @PathVariable Long id) {

        try {

            productService.deleteProduct(id);

            return ResponseEntity.ok(
                    new ApiResponse(
                            true,
                            "Product deleted successfully"
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            new ApiResponse(
                                    false,
                                    e.getMessage()
                            )
                    );
        }
    }

    // =========================
    // Search + Pagination
    // =========================

    @GetMapping("/browse")
    public ResponseEntity<ApiResponse> browseProducts(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {

        Page<Product> productPage =
                productService.getProducts(keyword, pageable);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Products fetched successfully",
                        productPage
                )
        );
    }

    // =========================
    // Get Product Stock
    // (Used for Add-to-Cart validation)
    // =========================

    @GetMapping("/{id}/stock")
    public ResponseEntity<ApiResponse> getProductStock(
            @PathVariable Long id) {

        try {

            Product product =
                    productService.getProductById(id);

            return ResponseEntity.ok(
                    new ApiResponse(
                            true,
                            "Stock fetched successfully",
                            product.getStock()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(404)
                    .body(
                            new ApiResponse(
                                    false,
                                    e.getMessage()
                            )
                    );
        }
    }

}