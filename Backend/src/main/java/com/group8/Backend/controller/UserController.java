package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.dto.response.UserResponse;
import com.group8.Backend.entity.User;
import com.group8.Backend.service.UserService;
import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.PasswordUpdateRequest;
import com.group8.Backend.dto.request.SubscriptionUpdateRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;

@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private RestClient.Builder builder;

    @PostMapping("/add")
    ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.createUser(request))
                .build();
    }


    @GetMapping
    ApiResponse<List<UserResponse>> getAllUsers(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUsers())
                .build();
    }
    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo()  {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }
    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUser(@PathVariable("userId") int userId) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable int userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        UserResponse user = userService.getUser(userId);
        if (user != null) {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User successfully deleted");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/myInfo/password")
    ApiResponse<UserResponse> updateMyPassword(@RequestBody @Valid PasswordUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.updateMyPassword(request))
                .build();
    }

    @PutMapping("/myInfo/subscription")
    ApiResponse<UserResponse> updateMySubscription(@RequestBody @Valid SubscriptionUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .result(userService.updateMySubscription(request))
                .build();
    }
}
