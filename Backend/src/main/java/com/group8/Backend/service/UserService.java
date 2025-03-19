package com.group8.Backend.service;

import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.dto.response.UserResponse;
import com.group8.Backend.entity.User;
import com.group8.Backend.enums.Role;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.mapper.UserMapper;
import com.group8.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

public UserResponse createUser(UserCreationRequest request) {
        if(userRepository.existsByEmail(request.getEmail()))
            throw  new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        User user = userMapper.toUser(request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10); //ma hoa password thep bcypt
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        user.setRoles(roles);


        return userMapper.toUserResponse(userRepository.save(user));
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
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
    public Optional<User> getUserById(int userId){
        return userRepository.findById(userId);
    }

}
