// src/main/java/com/kiranabazaar/service/ProductService.java

package com.kiranabazaar.service;

import com.kiranabazaar.exception.ResourceNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.Product;
import com.kiranabazaar.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    // Log4j2 logger — LogManager.getLogger() is native Log4j2
    // Logs go to Console + logs/app.log as configured in log4j2-spring.xml
    private static final Logger log = LogManager.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        log.info("Adding new product: name={}, price={}, stock={}", 
                 product.getName(), product.getPrice(), product.getStock());
        Product saved = productRepository.save(product);
        log.info("Product added successfully: id={}", saved.getId());
        return saved;
    }

    public List<Product> getAllProducts() {
        log.debug("Fetching all products");
        List<Product> products = productRepository.findAll();
        log.info("Fetched {} products", products.size());
        return products;
    }

    public Product getProductById(Long id) {
        log.debug("Fetching product by id={}", id);
        // Now throws ResourceNotFoundException (not RuntimeException)
        // GlobalExceptionHandler catches this → returns HTTP 404
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found: id={}", id);
                    return new ResourceNotFoundException("Product not found with id: " + id);
                });
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        log.info("Updating product: id={}", id);
        Product product = getProductById(id); // reuses logging + exception from above

        product.setName(updatedProduct.getName());
        product.setDescription(updatedProduct.getDescription());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setCategory(updatedProduct.getCategory());
        product.setImageUrl(updatedProduct.getImageUrl());

        Product saved = productRepository.save(product);
        log.info("Product updated: id={}", id);
        return saved;
    }

    public void deleteProduct(Long id) {
        log.info("Deleting product: id={}", id);
        Product product = getProductById(id);
        productRepository.delete(product);
        log.info("Product deleted: id={}", id);
    }

    public Page<Product> getProducts(String keyword, Pageable pageable) {
        log.debug("Browse products: keyword='{}', page={}, size={}", 
                  keyword, pageable.getPageNumber(), pageable.getPageSize());
        if (keyword != null && !keyword.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        return productRepository.findAll(pageable);
    }

    public Product updateStock(Long id, int quantity) {
        log.info("Updating stock: productId={}, newStock={}", id, quantity);
        Product product = getProductById(id);
        product.setStock(quantity);
        return productRepository.save(product);
    }

    public List<Product> getLowStockProducts() {
        log.info("Fetching low stock products (threshold < 5)");
        return productRepository.findByStockLessThan(5);
    }
}