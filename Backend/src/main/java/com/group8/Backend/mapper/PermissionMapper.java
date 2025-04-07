package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.PermissionRequest;
import com.group8.Backend.dto.response.PermissionResponse;
import com.group8.Backend.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(source = "permissionName", target = "permissionName")
    @Mapping(source = "description", target = "description")
    Permission toPermission(PermissionRequest request);

    @Mapping(source = "permissionId", target = "permissionId")
    @Mapping(source = "permissionName", target = "permissionName")
    @Mapping(source = "description", target = "description")
    PermissionResponse toPermissionResponse(Permission permission);
}