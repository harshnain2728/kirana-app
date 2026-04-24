package com.kiranabazaar.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kiranabazaar.entity.Address;
import com.kiranabazaar.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins ="*")
public class AddressController {
	
	private final AddressService addressService;
	
	public AddressController(
			AddressService addressService) {
		this.addressService = addressService;
	}
	
	/*-----------Add Address----------*/
	
	@PostMapping
	public ResponseEntity<Address> addAddress(
			@RequestParam Long userId,
			@RequestBody Address address){
		
		return ResponseEntity.ok(
				addressService.addAddress(userId, address));
	}
	
	/*---------Get User Addresses--------*/
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Address>> getUserAddresses(
			@PathVariable Long userId) {
		return ResponseEntity.ok(
				addressService.getUserAddresses(userId));
	}
	
	
	/*---------Update Address------*/
	
	@PutMapping("/{id}")
	public ResponseEntity<Address> updateAddress(
			@PathVariable Long id,
			@RequestBody Address address) {
		return ResponseEntity.ok(
				addressService.updateAddress(id, address));
	}
	
	/*---------Delete Address-------*/
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAddress(
			@PathVariable Long id) {
		
		addressService.deleteAddress(id);
		
		return ResponseEntity.ok("Address deleted");
	}
	
	@PutMapping("/{id}/default")
	public ResponseEntity<?> setDefaultAddress(
			@PathVariable Long id,
			@RequestParam Long userId) {
		
		addressService.setDefaultAddress(id, userId);
		
		return ResponseEntity.ok("Default address updated successfully");
	}
	
}
