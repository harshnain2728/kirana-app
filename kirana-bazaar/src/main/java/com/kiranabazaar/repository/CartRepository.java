package com.kiranabazaar.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.kiranabazaar.entity.User;
import com.kiranabazaar.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
	
	Optional<Cart> findByUser(User user);

}
