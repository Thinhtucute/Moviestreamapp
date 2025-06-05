package com.group8.Backend.service;

import com.group8.Backend.constant.PredefinedRole;
import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.dto.response.UserResponse;
import com.group8.Backend.entity.User;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.mapper.UserMapper;
import com.group8.Backend.repository.RoleRepository;
import com.group8.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.group8.Backend.entity.Role;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
    }

    public UserResponse createUser(UserCreationRequest request) {

        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findByRoleName(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        return userMapper.toUserResponse(user);
    }

    public UserResponse updateUser(int userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));

        userMapper.updateUser(user, request);
        user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // kiemr tra role admin truoc khi goi duoc ham
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name") // se goi ham truoc nhung se check kets qua tra ve
                                                                   // neu username trung voi authen thi success
    public UserResponse getUser(int userId) {
        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS)));
    }

    // lay thong tin sau khi dang nhap khong can truong tham so
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String username = context.getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTS));
        return userMapper.toUserResponse(user);
    }
}
