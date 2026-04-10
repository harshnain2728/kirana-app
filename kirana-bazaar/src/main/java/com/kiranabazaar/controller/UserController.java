package com.kiranabazaar.controller;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.kiranabazaar.common.response.ApiResponse;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.service.UserService;


// Controllers handles the HTTP requests from the client.
// Receive requests -> call service layer -> send responses
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
    	
    	System.out.println("REGISTER HIT: " + user.getEmail());
    	
        userService.register(user);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse(true, "Account created successfully"));
    }
    
    // Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody User user) {
        User loggedInUser =
                userService.login(user.getEmail(), user.getPassword());

        if (loggedInUser == null) {
            return ResponseEntity.status(401).
            		body(new ApiResponse(false, "Invalid credentials"));
        }

        return ResponseEntity.ok(
        		new ApiResponse(true, "Login successful", loggedInUser)
        		);
    }

    // Profile
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {
        try {
            Optional<User> existing = userService.getUserById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(404)
                    .body(new ApiResponse(false, "User not found"));
            }
            User user = existing.get();
            // Only update allowed fields
            if (updatedUser.getName()  != null) user.setName(updatedUser.getName());
            if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
            if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());

            userService.save(user);
            log.info("Profile updated for userId: {}", id);
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated", user));
        } catch (Exception e) {
            log.error("Profile update failed for userId: {} | {}", id, e.getMessage());
            return ResponseEntity.status(500)
                .body(new ApiResponse(false, "Update failed"));
        }
    }
    
    
    
    
    
}
