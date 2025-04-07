package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PermissionID")
    private int permissionId;

    @Column(name = "PermissionName", unique = true, nullable = false, length = 50)
    private String permissionName;

    @Column(name = "Description", length = 255)
    private String description;
}