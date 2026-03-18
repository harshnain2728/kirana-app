package com.kiranabazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kiranabazaar.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long>{

}
