package com.kiranabazaar.exception;

public class ResourceNotFoundException extends RuntimeException{

	// This constructor passes the message up to RuntimeException
    // When you throw new ResourceNotFoundException("Product not found with id: 5")
    // the Global Handler catches it and returns 404 with that message
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
