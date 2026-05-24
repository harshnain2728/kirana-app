package com.kiranabazaar.common.response;

public class ApiResponse {

    private boolean success;
    private String message;
    private Object data;

    // ✅ No-args constructor (important for Jackson)
    public ApiResponse() {
    }

    // ✅ All-args constructor (this is what UserController uses)
    public ApiResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // getters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
    
    public Object getData() {
        return data;
    }

    // setters
    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
    public void setData(Object data) {
        this.data = data;
    }
}