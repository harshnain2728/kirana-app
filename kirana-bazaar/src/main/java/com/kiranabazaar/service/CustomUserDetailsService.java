package com.kiranabazaar.service;

import java.util.Collections;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.kiranabazaar.entity.User;
import com.kiranabazaar.repository.UserRepository;


// This class connects Spring Security with your database.
//Look up the user using email. Fetch encrypted password Give this 
// information back to Spring Security. Spring compares passwords using BCrypt
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList()
        );
    }
}