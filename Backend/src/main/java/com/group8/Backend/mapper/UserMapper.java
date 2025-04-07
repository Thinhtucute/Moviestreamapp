package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.dto.request.UserUpdateRequest;
import com.group8.Backend.dto.response.UserResponse;
import com.group8.Backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {RoleMapper.class})
public interface UserMapper {
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "joinDate", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "subscriptionPlan", expression = "java(com.group8.Backend.entity.SubscriptionPlan.Free)")
    @Mapping(target = "accountStatus", expression = "java(com.group8.Backend.entity.AccountStatus.Active)")
    @Mapping(target = "roles", expression = "java(new java.util.HashSet<>())")
    User toUser(UserCreationRequest request);

    @Mapping(source = "userID", target = "userID")
    @Mapping(source = "avatarURL", target = "avatarURL")
    @Mapping(source = "subscriptionPlan", target = "subscriptionPlan")
    @Mapping(source = "accountStatus", target = "accountStatus")
    @Mapping(source = "roles", target = "roles")
    UserResponse toUserResponse(User user);

    @Mapping(target = "userID", ignore = true)
    @Mapping(target = "joinDate", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}