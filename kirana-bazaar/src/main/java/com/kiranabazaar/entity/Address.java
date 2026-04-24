package com.kiranabazaar.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String phone;
	
	private String street;
	
	private String city;
	
	private String pincode;
	
	private boolean isDefault = false;
	
	/*-----------RelationShip--------------*/
	
	@ManyToOne
	@JoinColumn(name ="user_id")
	private User user;
	
	/*----------Getter Setters-----------*/
	
	public Long getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name=name;
	}
	
	public String getPhone() {
		return phone;
	}
	
	public void setPhone(String phone) {
		this.phone= phone;
	}
	
	public String getStreet() {
		return street;
	}
	
	public void setStreet(String street) {
		this.street = street;
	}
	
	public String getCity() {
		return city;
	}
	
	public void setCity(String city) {
		this.city=city;
	}
	
	public String getPincode() {
		return pincode;
	}
	
	public void setPincode(String pincode) {
		this.pincode=pincode;
	}
	
	public boolean isDefault() {
		return isDefault;
	}
	
	public void setDefault(boolean aDefault) {
		isDefault= aDefault;
	}
	
	public User getUser() {
		return user;
	}
	
	public void setUser(User user) {
		this.user=user;
	}
}
