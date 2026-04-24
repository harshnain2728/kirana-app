package com.kiranabazaar.entity;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;
    private double totalAmount;
    private String status;
    private String paymentMethod;   // ✅ NEW

    // ✅ NEW — flat delivery address fields
    private String deliveryName;
    private String deliveryPhone;
    private String deliveryStreet;
    private String deliveryCity;
    private String deliveryPincode;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> items;

    // ── Getters & Setters ──

    public Long getId()                          { return id; }          // ✅ was missing

    public LocalDateTime getOrderDate()          { return orderDate; }
    public void setOrderDate(LocalDateTime d)    { this.orderDate = d; }

    public double getTotalAmount()               { return totalAmount; }
    public void setTotalAmount(double t)         { this.totalAmount = t; }

    public String getStatus()                    { return status; }
    public void setStatus(String s)              { this.status = s; }

    public String getPaymentMethod()             { return paymentMethod; }
    public void setPaymentMethod(String p)       { this.paymentMethod = p; }

    public User getUser()                        { return user; }
    public void setUser(User u)                  { this.user = u; }

    public List<OrderItem> getItems()            { return items; }
    public void setItems(List<OrderItem> i)      { this.items = i; }

    public String getDeliveryName()              { return deliveryName; }
    public void setDeliveryName(String s)        { this.deliveryName = s; }

    public String getDeliveryPhone()             { return deliveryPhone; }
    public void setDeliveryPhone(String s)       { this.deliveryPhone = s; }

    public String getDeliveryStreet()            { return deliveryStreet; }
    public void setDeliveryStreet(String s)      { this.deliveryStreet = s; }

    public String getDeliveryCity()              { return deliveryCity; }
    public void setDeliveryCity(String s)        { this.deliveryCity = s; }

    public String getDeliveryPincode()           { return deliveryPincode; }
    public void setDeliveryPincode(String s)     { this.deliveryPincode = s; }
}