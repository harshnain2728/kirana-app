package com.kiranabazaar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kiranabazaar.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

}
