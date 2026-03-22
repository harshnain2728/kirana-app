package com.kiranabazaar.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name="orders")
public class Order {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private LocalDateTime orderDate;
	
	private double totalAmount;
	
	private String status; // CREATED, SHIPPED, DELIVERED

	@ManyToOne
	private User user;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<OrderItem> items;
	
	public List<OrderItem> getItems() {return items;}
	public void setItems(List<OrderItem> items) {this.items=items;}
	
	public User getUser() {return user;}
	public void setUser(User user) {this.user=user;}
	
	public LocalDateTime getOrderDate() {return orderDate;}
	public void setOrderDate(LocalDateTime orderDate) {this.orderDate=orderDate;}
	
	public String getStatus() {return status;}
	public void setStatus(String status) {this.status=status;}
	
	
	public double getTotalAmount() {return totalAmount;}
	public void setTotalAmount(double totalAmount) {
		this.totalAmount=totalAmount;
		
	}
}
