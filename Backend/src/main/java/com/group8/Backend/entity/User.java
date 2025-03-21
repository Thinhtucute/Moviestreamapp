package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID") // Khớp với tên cột trong DB
    int userID;

    @Column(name = "Username", nullable = false, unique = true, length = 50)
    String username;

    @Column(name = "Email", nullable = false, unique = true, length = 100)
    String email;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    String passwordHash;

    @Column(name = "JoinDate", nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    LocalDateTime joinDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "SubscriptionPlan", nullable = false, columnDefinition = "ENUM('Free', 'Premium', 'VIP') DEFAULT 'Free'")
    SubscriptionPlan subscriptionPlan = SubscriptionPlan.Free;

    @Column(name = "SubscriptionExpiry")
    LocalDate subscriptionExpiry;

    @Column(name = "AvatarURL")
    String avatarURL;

    @Column(name = "LastLogin")
    LocalDateTime lastLogin;

    @Enumerated(EnumType.STRING)
    @Column(name = "AccountStatus", nullable = false, columnDefinition = "ENUM('Active', 'Banned', 'Suspended') DEFAULT 'Active'")
    AccountStatus accountStatus = AccountStatus.Active;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role", // Khớp với tên bảng trong DB
            joinColumns = @JoinColumn(name = "UserID"),
            inverseJoinColumns = @JoinColumn(name = "RoleID")
    )
    Set<Role> roles = new HashSet<>();


}