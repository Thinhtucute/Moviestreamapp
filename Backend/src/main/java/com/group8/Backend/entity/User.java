package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userID;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime joinDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('Free', 'Premium', 'VIP') DEFAULT 'Free'")
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.Free;

    private LocalDate subscriptionExpiry;

    private String avatarURL;

    private LocalDateTime lastLogin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('Active', 'Banned', 'Suspended') DEFAULT 'Active'")
    private AccountStatus accountStatus = AccountStatus.Active;


}





