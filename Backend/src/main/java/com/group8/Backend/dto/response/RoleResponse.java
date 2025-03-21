package com.group8.Backend.dto.response;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private int roleId;
    private String roleName;
    private String description;
    private Set<PermissionResponse> permissions;
}