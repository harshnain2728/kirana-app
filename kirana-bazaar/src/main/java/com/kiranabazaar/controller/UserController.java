package com.kiranabazaar.controller;

import java.util.Optional;

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

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {

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
}
