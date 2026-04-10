package com.kiranabazaar.service;

import com.kiranabazaar.config.JwtService;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.Role;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.UserRepository;


// Contains the business logics and validations 
// It acts as a bridge between the controller and repository.
// Business rules, validations, and calculations are written here.

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        user.setRole(Role.USER);
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
        
        String token = jwtService.generateToken(user);
        user.setToken(token);
        return user;
    }

    // Profile
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    //save 
    public User save(User user) {
    	return userRepository.save(user);
    }
}