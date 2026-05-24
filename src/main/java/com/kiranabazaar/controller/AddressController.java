// src/main/java/com/kiranabazaar/controller/AddressController.java

package com.kiranabazaar.controller;

import java.util.List;

import com.kiranabazaar.common.response.ApiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.entity.Address;
import com.kiranabazaar.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    private static final Logger log = LogManager.getLogger(AddressController.class);

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Add Address
    // Was returning raw Address — now returns ApiResponse (consistent with all other endpoints)
    @PostMapping
    public ResponseEntity<ApiResponse> addAddress(
            @RequestParam Long userId,
            @RequestBody Address address) {

        log.info("POST /api/addresses — userId={}", userId);
        Address saved = addressService.addAddress(userId, address);
        return ResponseEntity.ok(new ApiResponse(true, "Address added successfully", saved));
    }

    // Get User Addresses
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserAddresses(@PathVariable Long userId) {

        log.debug("GET /api/addresses/user/{}", userId);
        List<Address> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Addresses fetched successfully", addresses));
    }

    // Update Address
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAddress(
            @PathVariable Long id,
            @RequestBody Address address) {

        log.info("PUT /api/addresses/{}", id);
        Address updated = addressService.updateAddress(id, address);
        return ResponseEntity.ok(new ApiResponse(true, "Address updated successfully", updated));
    }

    // Delete Address
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAddress(@PathVariable Long id) {

        log.info("DELETE /api/addresses/{}", id);
        addressService.deleteAddress(id);
        return ResponseEntity.ok(new ApiResponse(true, "Address deleted successfully"));
    }

    // Set Default Address
    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse> setDefaultAddress(
            @PathVariable Long id,
            @RequestParam Long userId) {

        log.info("PUT /api/addresses/{}/default — userId={}", id, userId);
        addressService.setDefaultAddress(id, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Default address updated successfully"));
    }
}