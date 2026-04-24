package com.kiranabazaar.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kiranabazaar.entity.Address;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.AddressRepository;
import com.kiranabazaar.repository.UserRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    /* ───────── Add Address ───────── */

    @Transactional
    public Address addAddress(Long userId, Address address) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        address.setUser(user);

        // If first address → auto default
        List<Address> existing =
                addressRepository.findByUserId(userId);

        if (existing.isEmpty()) {
            address.setDefault(true);
        }

        // If marked default → clear others
        if (address.isDefault()) {
            clearDefaultAddress(userId);
        }

        return addressRepository.save(address);
    }

    /* ───────── Get All Addresses ───────── */

    public List<Address> getUserAddresses(Long userId) {

        return addressRepository.findByUserId(userId);
    }

    /* ───────── Update Address ───────── */

    @Transactional
    public Address updateAddress(
            Long id,
            Address updatedAddress) {

        Address address = addressRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Address not found"));

        address.setName(updatedAddress.getName());
        address.setPhone(updatedAddress.getPhone());
        address.setStreet(updatedAddress.getStreet());
        address.setCity(updatedAddress.getCity());
        address.setPincode(updatedAddress.getPincode());

        // Handle default logic
        if (updatedAddress.isDefault()) {

            Long userId =
                    address.getUser().getId();

            clearDefaultAddress(userId);

            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    /* ───────── Delete Address ───────── */

    @Transactional
    public void deleteAddress(Long id) {

        Address address =
                addressRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Address not found"));

        Long userId =
                address.getUser().getId();

        boolean wasDefault =
                address.isDefault();

        addressRepository.delete(address);

        // If default deleted → set another default
        if (wasDefault) {

            List<Address> remaining =
                    addressRepository.findByUserId(userId);

            if (!remaining.isEmpty()) {

                Address first =
                        remaining.get(0);

                first.setDefault(true);

                addressRepository.save(first);
            }
        }
    }

    /* ───────── Set Default Address ───────── */

    @Transactional
    public void setDefaultAddress(
            Long addressId,
            Long userId) {

        Address address =
                addressRepository.findById(addressId)
                        .orElseThrow(() ->
                                new RuntimeException("Address not found"));

        // Security Check
        if (!address.getUser().getId().equals(userId)) {

            throw new RuntimeException(
                    "Address does not belong to user");
        }

        clearDefaultAddress(userId);

        address.setDefault(true);

        addressRepository.save(address);
    }

    /* ───────── Clear Default Helper ───────── */

    @Transactional
    private void clearDefaultAddress(Long userId) {

        Address defaultAddress =
                addressRepository
                        .findByUserIdAndIsDefaultTrue(userId);

        if (defaultAddress != null) {

            defaultAddress.setDefault(false);

            addressRepository.save(defaultAddress);
        }
    }
}