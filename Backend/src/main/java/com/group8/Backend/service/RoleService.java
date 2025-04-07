package com.group8.Backend.service;


import com.group8.Backend.dto.request.PermissionRequest;
import com.group8.Backend.dto.request.RoleRequest;
import com.group8.Backend.dto.response.PermissionResponse;
import com.group8.Backend.dto.response.RoleResponse;
import com.group8.Backend.entity.Permission;
import com.group8.Backend.mapper.PermissionMapper;
import com.group8.Backend.mapper.RoleMapper;
import com.group8.Backend.repository.PermissionRepository;
import com.group8.Backend.repository.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse createRole(RoleRequest request) {
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public void delete(Integer roleId) {
        roleRepository.deleteById(roleId);
    }
}
