package com.kiranabazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.kiranabazaar.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}