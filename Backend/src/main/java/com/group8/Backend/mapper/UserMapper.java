package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.UserCreationRequest;
import com.group8.Backend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);
}
