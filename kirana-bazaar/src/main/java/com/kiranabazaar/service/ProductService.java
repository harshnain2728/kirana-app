package com.kiranabazaar.service;

import org.springframework.data.domain.Pageable;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.Product;
import com.kiranabazaar.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // =========================
    // Add Product
    // =========================

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // =========================
    // Get All Products
    // =========================

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // =========================
    // Get Product By Id
    // =========================

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id));
    }

    // =========================
    // Update Product
    // =========================

    public Product updateProduct(Long id,
                                 Product updatedProduct) {

        Product product = getProductById(id);

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setCategory(updatedProduct.getCategory());
        product.setImageUrl(updatedProduct.getImageUrl());

        return productRepository.save(product);
    }

    // =========================
    // Delete Product
    // =========================

    public void deleteProduct(Long id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }

    // =========================
    // Search + Pagination
    // =========================

    public Page<Product> getProducts(String keyword,
                                     Pageable pageable) {

        if (keyword != null && !keyword.isEmpty()) {

            return productRepository
                    .findByNameContainingIgnoreCase(
                            keyword,
                            pageable
                    );
        }

        return productRepository.findAll(pageable);
    }

    // =========================
    // Update Stock
    // =========================

    public Product updateStock(Long id,
                               int quantity) {

        Product product = getProductById(id);

        product.setStock(quantity);

        return productRepository.save(product);
    }

    // =========================
    // Low Stock Products
    // =========================

    public List<Product> getLowStockProducts() {

        return productRepository
                .findByStockLessThan(5);
    }
}