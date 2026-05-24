// src/main/java/com/kiranabazaar/exception/GlobalExceptionHandler.java

package com.kiranabazaar.exception;

import com.kiranabazaar.common.response.ApiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

// @RestControllerAdvice = Spring scans ALL @RestController classes
// Any unhandled exception bubbles up here automatically
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Log4j2 logger — using LogManager (native Log4j2 API, not SLF4J)
    // This logs every exception with full stack trace to logs/app.log
    private static final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);

    // ─── 404 Not Found ───────────────────────────────────────────────
    // Fires when ProductService/OrderService throws ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, ex.getMessage()));
    }

    // ─── 400 Bad Request ─────────────────────────────────────────────
    // Fires when service throws BadRequestException (e.g. empty cart, out of stock)
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, ex.getMessage()));
    }

    // ─── 400 Validation Error ─────────────────────────────────────────
    // Fires when @Valid fails on @RequestBody (e.g. blank email, null price)
    // Collects ALL field errors into one readable message
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("Validation failed: {}", errors);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Validation error: " + errors));
    }

    // ─── 500 Catch-All ───────────────────────────────────────────────
    // Fires for ANY unexpected exception not caught above
    // Logs full stack trace so you can debug — but returns generic message to client
    // (Never expose internal stack traces to client — security risk)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneric(Exception ex) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex); // 3rd arg = logs full stack trace
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Something went wrong. Please try again later."));
    }
}