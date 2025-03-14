package com.group8.Backend.service;

import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.entity.User;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.mapper.UserMapper;
import com.group8.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    public User createUser(UserCreationRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        User user = userMapper.toUser(request);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10); //ma hoa password thep bcypt
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
//        User user = new User();
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setPasswordHash(request.getPasswordHash());
//        user.setAvatarURL(request.getAvatarURL());
//        user.setSubscriptionPlan(request.getSubscriptionPlan());
//        user.setAccountStatus(request.getAccountStatus());

        return userRepository.save(user);
    }

    public User updateUser(int userId, UserUpdateRequest request){
        Optional<User> optionalUser = getUserById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User with ID " + userId + " not found.");
        }
        User user = optionalUser.get();
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setPasswordHash(request.getPasswordHash());
//        user.setSubscriptionPlan(request.getSubscriptionPlan());
//        user.setSubscriptionExpiry(request.getSubscriptionExpiry());
//        user.setAvatarURL(request.getAvatarUrl());
//        user.setAccountStatus(request.getAccountStatus());
        return userRepository.save(user);
    }
    public void deleteUser(int userId){
        userRepository.deleteById(userId);
    }
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public Optional<User> getUserById(int userId){
        return userRepository.findById(userId);
    }

}
