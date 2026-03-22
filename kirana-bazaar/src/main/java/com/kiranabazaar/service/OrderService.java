package com.kiranabazaar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.*;
import com.kiranabazaar.repository.*;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final UserRepository userRepository;

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    // ✅ Place Order
    @Transactional
    public Order placeOrder(Long userId) {
    	
    	User user = userRepository.findById(userId)
    			.orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        
        if(cart.getItems().isEmpty()) {
        	throw new RuntimeException("Cart is Empty");
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("CREATED");

        List<OrderItem> orderItems = new ArrayList<>();

        double total = 0;

        for (CartItem cartItem : cart.getItems()) {

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getProduct().getPrice());
            
            total += item.getPrice() * item.getQuantity();
            
            orderItems.add(item);
        }
        
        order.setItems(orderItems);
        order.setTotalAmount(total);
        
        // Clear cart after order
        cart.getItems().clear();
        cartRepository.save(cart);
        
        return orderRepository.save(order);
    }
}
           