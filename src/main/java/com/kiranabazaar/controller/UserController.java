package com.kiranabazaar.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.exception.ResourceNotFoundException;
import com.kiranabazaar.service.UserService;

// Controllers handles the HTTP requests from the client.
// Receive requests -> call service layer -> send responses
@RestController
@RequestMapping("/api/users")
public class UserController {

    // ✅ FIXED: SLF4J LoggerFactory → Log4j2 LogManager (consistent with whole project)
    private static final Logger log = LogManager.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        log.info("REGISTER HIT: {}", user.getEmail());
        userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "Account created successfully"));
    }

    // Login
    // ✅ FIXED: removed null check — UserService now throws BadRequestException on bad creds
    // GlobalExceptionHandler catches it → returns 400 automatically
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody User user) {
        log.info("LOGIN attempt: {}", user.getEmail());
        User loggedInUser = userService.login(user.getEmail(), user.getPassword());
        log.info("LOGIN success: {}", user.getEmail());
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", loggedInUser));
    }

    // Profile
    // ✅ FIXED: Optional → throw ResourceNotFoundException → GlobalHandler → 404
    // Removed raw ResponseEntity<?>, now returns consistent ApiResponse
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProfile(@PathVariable Long id) {
        log.debug("GET profile userId={}", id);
        User user = userService.getUserById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return ResponseEntity.ok(new ApiResponse(true, "User fetched", user));
    }

    // ✅ FIXED: removed manual try/catch — GlobalHandler handles all exceptions
    // No more swallowed exceptions blocking GlobalExceptionHandler
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        log.info("UPDATE profile userId={}", id);
        User user = userService.getUserById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (updatedUser.getName()  != null) user.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());

        userService.save(user);
        log.info("Profile updated userId={}", id);
        return ResponseEntity.ok(new ApiResponse(true, "Profile updated", user));
    }
}