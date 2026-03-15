package com.kiranabazaar.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.UserRepository;


// Contains the business logics and validations 
// It acts as a bridge between the controller and repository.
// Business rules, validations, and calculations are written here.

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Login
    public User login(String email, String rawPassword) {

        email = email.trim();
        rawPassword = rawPassword.trim();


        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            System.out.println("User not found with email: " + email);
            return null;
        }

        User user = userOpt.get();

        boolean match = passwordEncoder.matches(rawPassword, user.getPassword());


        if (!match) {
            return null;
        }

        return user;
    }

    // Profile
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}