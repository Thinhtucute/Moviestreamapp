package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchConnectionDetails;

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
@Table(name = "Users") // Khớp với tên bảng trong DB


public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     int userID;

    @Column(nullable = false, unique = true, length = 50)
     String username;

    @Column(nullable = false, unique = true, length = 100)
     String email;

    @Column(nullable = false, length = 255)
     String passwordHash;

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
     LocalDateTime joinDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('Free', 'Premium', 'VIP') DEFAULT 'Free'")
     SubscriptionPlan subscriptionPlan = SubscriptionPlan.Free;

     LocalDate subscriptionExpiry;

     String avatarURL;

     LocalDateTime lastLogin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('Active', 'Banned', 'Suspended') DEFAULT 'Active'")
     AccountStatus accountStatus = AccountStatus.Active;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "Roles", joinColumns = @JoinColumn(name = "UserID"))
    @Column(name = "role", nullable = false)
     Set<String> roles;

}





