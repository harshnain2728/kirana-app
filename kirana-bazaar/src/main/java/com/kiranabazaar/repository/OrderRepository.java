package com.kiranabazaar.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.kiranabazaar.entity.Order;
import com.kiranabazaar.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
}