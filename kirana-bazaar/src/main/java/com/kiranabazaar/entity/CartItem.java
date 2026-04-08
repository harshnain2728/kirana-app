package com.kiranabazaar.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import com.kiranabazaar.entity.Product;

@Entity
public class CartItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JsonBackReference
	private Cart cart;
	
	@ManyToOne
	private Product product;
	
	private int quantity;
	
	//Getters & Setters
	public Long getId()
	{
		return id;
	}
	
	public Cart getCart() {
		return cart;
	}
	
	public void setCart(Cart cart) {
		this.cart = cart;
	}
	
	public Product getProduct()
	{
		return product;
	}
	
	public void setProduct(Product product) 
	{
		this.product = product;
	}

	public int getQuantity() 
	{
		return quantity;
	}
	
	public void setQuantity(int quantity)
	{
		this.quantity = quantity;
	}
}
