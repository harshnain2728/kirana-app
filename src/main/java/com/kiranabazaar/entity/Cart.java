package com.kiranabazaar.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;


@Entity
public class Cart {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	private User user;
	
	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
	@JsonManagedReference
	private List<CartItem> items;
	
	//Getters & Setters
	public Long getId() { return id; }
	
	public User getUser() { return user; }
	
	public void setUser(User user) 
	{ 
		this.user = user; 
	}
	
	public List<CartItem> getItems() 
	{ 
		return items; 
	}
	
	public void setItems(List<CartItem> items) 
	{
		this.items = items; 
	}
	
	@Transient
	public double getTotalPrice() {
		if(items == null) return 0;
		
		return items.stream()
				.mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
				.sum();
	}
}
