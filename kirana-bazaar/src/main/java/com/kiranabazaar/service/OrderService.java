package com.kiranabazaar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.kiranabazaar.entity.*;
import com.kiranabazaar.repository.*;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }
    
    @Autowired
    public List<Order> getAllOrders()
    {
    	return orderRepository.findAll();
    }
    
    public Order updateOrderStatus(Long id, String status) {
    	Order order = orderRepository.findById(id)
    			.orElseThrow(() -> new RuntimeException("Order not found"));
    	
    	order.setStatus(status);
    	return orderRepository.save(order);
    
    }

    @Transactional
    public Order placeOrder(Long userId, Map<String, Object> orderRequest) {

        // ── Get user ──
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ── Get items from frontend request ──
        List<Map<String, Object>> items =
                (List<Map<String, Object>>) orderRequest.get("items");

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("No items in order");
        }

        // ── Build order ──
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CREATED");

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("id").toString());
            int quantity   = Integer.parseInt(item.get("quantity").toString());
            double price   = Double.parseDouble(item.get("price").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(price);

            total += price * quantity;
            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        return orderRepository.save(order);
    }
}