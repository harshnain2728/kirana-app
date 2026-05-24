package com.kiranabazaar.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.UserRepository;

// Connects Spring Security with DB.
// Looks up user by email, returns UserDetails for JWT auth filter.
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // ✅ FIXED: SLF4J → Log4j2 native API
    private static final Logger log = LogManager.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // NOTE: UsernameNotFoundException is intentionally kept here — do NOT replace with
        // ResourceNotFoundException. Spring Security itself catches UsernameNotFoundException
        // during JWT filter chain. GlobalExceptionHandler is NOT active at that point.
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                log.warn("Spring Security: user not found: {}", email);
                return new UsernameNotFoundException("User not found: " + email);
            });

        log.debug("Spring Security loaded user: {}, role={}", email, user.getRole());
        return user;
    }
}