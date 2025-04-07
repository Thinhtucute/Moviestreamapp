package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.RoleRequest;
import com.group8.Backend.dto.response.RoleResponse;
import com.group8.Backend.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {PermissionMapper.class})
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    @Mapping(source = "roleId", target = "roleId")
    @Mapping(source = "roleName", target = "roleName")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "permissions", target = "permissions")
    RoleResponse toRoleResponse(Role role);
}