package com.kiranabazaar.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    // ===============================
    // Get All Orders (Admin)
    // ===============================

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ===============================
    // Update Order Status (Admin)
    // ===============================

    public Order updateOrderStatus(Long id, String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with ID: " + id));

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // ===============================
    // Place Order (User)
    // ===============================

    @Transactional
    public Order placeOrder(Long userId,
                            Map<String, Object> orderRequest) {

        // ── Get user ──

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: " + userId));

        // ── Get items from frontend ──

        List<Map<String, Object>> items =
                (List<Map<String, Object>>) orderRequest.get("items");

        if (items == null || items.isEmpty()) {
            throw new RuntimeException("No items in order");
        }

        // ── Create Order ──

        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());

        // Better default status
        order.setStatus("PLACED");

        List<OrderItem> orderItems = new ArrayList<>();

        double totalAmount = 0;

        // ── Process Each Item ──

        for (Map<String, Object> item : items) {

            Long productId =
                    Long.valueOf(item.get("id").toString());

            int quantity =
                    Integer.parseInt(item.get("quantity").toString());

            double price =
                    Double.parseDouble(item.get("price").toString());

            // ── Fetch product ──

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found with ID: "
                                            + productId));

            // ===============================
            // STOCK VALIDATION
            // ===============================

            if (product.getStock() < quantity) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getName()
                                + " | Available: "
                                + product.getStock());
            }

            // ===============================
            // REDUCE STOCK
            // ===============================

            product.setStock(
                    product.getStock() - quantity);

            productRepository.save(product);

            // ===============================
            // CREATE ORDER ITEM
            // ===============================

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(quantity);
            orderItem.setPrice(price);

            totalAmount += price * quantity;

            orderItems.add(orderItem);
        }

        // ── Set order details ──

        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);

        // ── Save order ──

        return orderRepository.save(order);
    }
}