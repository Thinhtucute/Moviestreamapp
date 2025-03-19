package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.dto.response.UserResponse;
import com.group8.Backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget  User user, UserUpdateRequest request);
}
