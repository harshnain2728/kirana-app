// src/main/java/com/kiranabazaar/service/OrderService.java

package com.kiranabazaar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.kiranabazaar.exception.BadRequestException;
import com.kiranabazaar.exception.ResourceNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kiranabazaar.entity.Order;
import com.kiranabazaar.entity.OrderItem;
import com.kiranabazaar.entity.Product;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.OrderRepository;
import com.kiranabazaar.repository.ProductRepository;
import com.kiranabazaar.repository.UserRepository;

@Service
public class OrderService {

    private static final Logger log = LogManager.getLogger(OrderService.class);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository   = orderRepository;
        this.userRepository    = userRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAllOrders() {
        log.info("Admin: fetching all orders");
        List<Order> orders = orderRepository.findAll();
        log.info("Total orders fetched: {}", orders.size());
        return orders;
    }

    public Order updateOrderStatus(Long id, String status) {
        log.info("Updating order status: orderId={}, newStatus={}", id, status);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Order not found: id={}", id);
                    return new ResourceNotFoundException("Order not found with ID: " + id);
                });
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        log.info("Order status updated: orderId={}, status={}", id, status);
        return saved;
    }

    @Transactional
    public Order placeOrder(Long userId, Map<String, Object> orderRequest) {
        log.info("Placing order for userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for order: userId={}", userId);
                    return new ResourceNotFoundException("User not found with ID: " + userId);
                });

        List<Map<String, Object>> items =
                (List<Map<String, Object>>) orderRequest.get("items");

        if (items == null || items.isEmpty()) {
            log.warn("Order attempt with no items: userId={}", userId);
            throw new BadRequestException("No items in order");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("productId").toString());
            int qty = Integer.parseInt(item.get("quantity").toString());

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> {
                        log.warn("Product not found during order: productId={}", productId);
                        return new ResourceNotFoundException("Product not found with ID: " + productId);
                    });

            if (product.getStock() < qty) {
                log.warn("Insufficient stock: productId={}, requested={}, available={}", 
                         productId, qty, product.getStock());
                throw new BadRequestException(
                    "Insufficient stock for product: " + product.getName() + 
                    ". Available: " + product.getStock()
                );
            }

            product.setStock(product.getStock() - qty);
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(qty);
            orderItem.setPrice(product.getPrice());
            orderItem.setOrder(order);
            orderItems.add(orderItem);

            total += product.getPrice() * qty;
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        log.info("Order placed: orderId={}, userId={}, total={}, items={}", 
                 saved.getId(), userId, total, orderItems.size());
        return saved;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        log.debug("Fetching orders for userId={}", userId);
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long id) {
        log.debug("Fetching order by id={}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Order not found: id={}", id);
                    return new ResourceNotFoundException("Order not found with ID: " + id);
                });
    }

}