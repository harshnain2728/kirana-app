package com.kiranabazaar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kiranabazaar.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;


public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

	List<Product> findByStockLessThan(int threshold);
}