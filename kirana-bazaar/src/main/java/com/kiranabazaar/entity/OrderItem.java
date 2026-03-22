package com.kiranabazaar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class OrderItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private int quantity;
	private double price;
	
	@ManyToOne
	private Product product;
	
	@JsonBackReference
	@ManyToOne
	private Order order;
	
	// Getters & Setters
	public Long getId() {return id;}
	
	public Order getOrder() {return order;}
	public void setOrder(Order order) {this.order=order;}
	
	public Product getProduct() {return product;}
	public void setProduct(Product product) {this.product=product;}
	
	public int getQuantity() {return quantity;}
	public void setQuantity(int quantity) {this.quantity=quantity;}
	
	public double getPrice() {return price;}
	public void setPrice(double price) {this.price=price;}
}
