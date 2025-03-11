package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.entity.User;
import com.group8.Backend.service.UserService;
import com.group8.Backend.dto.request.UserCreationRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/add")
    ApiResponse<User> addUser(@RequestBody @Valid UserCreationRequest userDTO) {
        ApiResponse<User> newUser = new ApiResponse<>();
        newUser.setResult(userService.createUser(userDTO));
        return newUser;
    }
    @GetMapping
    List<User> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable int userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    @PutMapping("/{userId}")
    User updateUser(@PathVariable int userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User successfully deleted");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
