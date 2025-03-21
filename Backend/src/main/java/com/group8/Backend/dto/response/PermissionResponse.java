package com.group8.Backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermissionResponse {
    private int permissionId;
    private String permissionName;
    private String description;
}