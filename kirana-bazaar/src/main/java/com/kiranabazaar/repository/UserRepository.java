package com.kiranabazaar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kiranabazaar.entity.User;

// It will perform the SQL operation like save(), findbyEmail(), deleteById()
// No need to write the manual queries. It directly interacts with database using Spring Data JPA.
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}




