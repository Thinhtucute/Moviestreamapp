package com.group8.Backend.exception;

import com.group8.Backend.dto.request.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handLingRuntimeException(RuntimeException e){
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(1001);
        apiResponse.setMessage(e.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);

    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handLingRuntimeException(AppException e){
        ErrorCode errorCode = e.getErrorCode();
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiResponse);

    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<String> handLingMethodArgumentNotValidException(MethodArgumentNotValidException e){
        return ResponseEntity.badRequest().body(Objects.requireNonNull(e.getFieldError()).getDefaultMessage());
    }
}
