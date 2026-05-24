package com.kiranabazaar.service;

import com.kiranabazaar.config.JwtService;
import com.kiranabazaar.exception.BadRequestException;
import com.kiranabazaar.exception.ResourceNotFoundException;

import java.util.Optional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.Role;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.UserRepository;

// Contains the business logics and validations
// It acts as a bridge between the controller and repository.
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ✅ FIXED: SLF4J → Log4j2 native API
    private static final Logger log = LogManager.getLogger(UserService.class);

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Register
    public User register(User user) {
        log.info("Registering new user: {}", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.USER);
        User saved = userRepository.save(user);
        log.info("User registered: userId={}", saved.getId());
        return saved;
    }

    // Login
    // ✅ FIXED: removed null returns — throw exceptions so GlobalExceptionHandler fires
    public User login(String email, String rawPassword) {
        String trimmedEmail = email.trim();
        String trimmedPassword = rawPassword.trim();

        log.info("Login attempt: {}", trimmedEmail);

        User user = userRepository.findByEmail(trimmedEmail)
            .orElseThrow(() -> {
                log.warn("Login failed — user not found: {}", trimmedEmail);
                return new ResourceNotFoundException("No account found with email: " + trimmedEmail);
            });

        if (!passwordEncoder.matches(trimmedPassword, user.getPassword())) {
            log.warn("Login failed — wrong password: {}", trimmedEmail);
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        user.setToken(token);
        log.info("Login success: userId={}", user.getId());
        return user;
    }

    // Profile
    public Optional<User> getUserById(Long id) {
        log.debug("Fetching user: userId={}", id);
        return userRepository.findById(id);
    }

    // Save
    public User save(User user) {
        return userRepository.save(user);
    }
}