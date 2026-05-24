// src/main/java/com/kiranabazaar/service/AddressService.java

package com.kiranabazaar.service;

import java.util.List;

import com.kiranabazaar.exception.BadRequestException;
import com.kiranabazaar.exception.ResourceNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kiranabazaar.entity.Address;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.AddressRepository;
import com.kiranabazaar.repository.UserRepository;

@Service
public class AddressService {

    private static final Logger log = LogManager.getLogger(AddressService.class);

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository,
                          UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // ─── Add Address ──────────────────────────────────────────────────
    @Transactional
    public Address addAddress(Long userId, Address address) {

        log.info("addAddress called: userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found: userId={}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        address.setUser(user);

        List<Address> existing = addressRepository.findByUserId(userId);

        // First address auto-becomes default — user always has a default
        if (existing.isEmpty()) {
            log.info("First address for userId={} — setting as default", userId);
            address.setDefault(true);
        }

        // If incoming address is marked default → clear old default first
        if (address.isDefault()) {
            log.debug("Clearing existing default address for userId={}", userId);
            clearDefaultAddress(userId);
        }

        Address saved = addressRepository.save(address);
        log.info("Address added: addressId={}, userId={}, isDefault={}", 
                 saved.getId(), userId, saved.isDefault());
        return saved;
    }

    // ─── Get All Addresses ────────────────────────────────────────────
    public List<Address> getUserAddresses(Long userId) {

        log.debug("getUserAddresses called: userId={}", userId);
        List<Address> addresses = addressRepository.findByUserId(userId);
        log.info("Addresses fetched: userId={}, count={}", userId, addresses.size());
        return addresses;
    }

    // ─── Update Address ───────────────────────────────────────────────
    @Transactional
    public Address updateAddress(Long id, Address updatedAddress) {

        log.info("updateAddress called: addressId={}", id);

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Address not found: addressId={}", id);
                    return new ResourceNotFoundException("Address not found with id: " + id);
                });

        address.setName(updatedAddress.getName());
        address.setPhone(updatedAddress.getPhone());
        address.setStreet(updatedAddress.getStreet());
        address.setCity(updatedAddress.getCity());
        address.setPincode(updatedAddress.getPincode());

        if (updatedAddress.isDefault()) {
            Long userId = address.getUser().getId();
            log.debug("Marking address as default: addressId={}, userId={}", id, userId);
            clearDefaultAddress(userId);
            address.setDefault(true);
        }

        Address saved = addressRepository.save(address);
        log.info("Address updated: addressId={}", id);
        return saved;
    }

    // ─── Delete Address ───────────────────────────────────────────────
    @Transactional
    public void deleteAddress(Long id) {

        log.info("deleteAddress called: addressId={}", id);

        Address address = addressRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Address not found: addressId={}", id);
                    return new ResourceNotFoundException("Address not found with id: " + id);
                });

        Long userId = address.getUser().getId();
        boolean wasDefault = address.isDefault();

        addressRepository.delete(address);
        log.info("Address deleted: addressId={}, wasDefault={}", id, wasDefault);

        // If deleted address was default → auto-promote next address as default
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setDefault(true);
                addressRepository.save(first);
                log.info("Auto-promoted new default address: addressId={}, userId={}", 
                         first.getId(), userId);
            }
        }
    }

    // ─── Set Default Address ──────────────────────────────────────────
    @Transactional
    public void setDefaultAddress(Long addressId, Long userId) {

        log.info("setDefaultAddress called: addressId={}, userId={}", addressId, userId);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> {
                    log.warn("Address not found: addressId={}", addressId);
                    return new ResourceNotFoundException("Address not found with id: " + addressId);
                });

        // Security: address must belong to the requesting user
        // BadRequestException → HTTP 400 (not 500)
        if (!address.getUser().getId().equals(userId)) {
            log.warn("Ownership violation: addressId={} does not belong to userId={}", addressId, userId);
            throw new BadRequestException("Address does not belong to user");
        }

        clearDefaultAddress(userId);
        address.setDefault(true);
        addressRepository.save(address);

        log.info("Default address set: addressId={}, userId={}", addressId, userId);
    }

    // ─── Private Helper: Clear Default ────────────────────────────────
    // Not logged at INFO because it's internal — DEBUG is enough
    @Transactional
    private void clearDefaultAddress(Long userId) {
        Address defaultAddress = addressRepository.findByUserIdAndIsDefaultTrue(userId);
        if (defaultAddress != null) {
            log.debug("Clearing default flag from addressId={}", defaultAddress.getId());
            defaultAddress.setDefault(false);
            addressRepository.save(defaultAddress);
        }
    }
}