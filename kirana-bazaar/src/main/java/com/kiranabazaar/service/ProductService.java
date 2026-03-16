package com.kiranabazaar.service;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

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

    // Add Product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Get All Products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get Product By Id
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Update Product
    public Product updateProduct(Long id, Product updatedProduct) {

        Product product = productRepository.findById(id)
        		.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            product.setCategory(updatedProduct.getCategory());
            product.setImageUrl(updatedProduct.getImageUrl());

            return productRepository.save(product);
        }

    
    // Delete Product
    public void deleteProduct(Long id) {
    	
    	Product product = productRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    		
    	productRepository.delete(product);
    }
    
    
    // Search product using the keyword like "rice" (Search + Pagination)
    public Page<Product> getProducts(String keyword, Pageable pageable) {

        if (keyword != null && !keyword.isEmpty()) {
            return  productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }

        return productRepository.findAll(pageable);
    }
}