package com.group8.Backend.dto.response;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.SubscriptionPlan;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class UserResponse {
    int userID;
    String username;
    String email;
    LocalDateTime joinDate;
    SubscriptionPlan subscriptionPlan;
    LocalDate subscriptionExpiry;
    String avatarURL;
    LocalDateTime lastLogin;
    AccountStatus accountStatus;
    Set<String> roles;

}
