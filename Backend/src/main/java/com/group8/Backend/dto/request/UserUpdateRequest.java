package com.group8.Backend.dto.request;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.SubscriptionPlan;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String username;
    String email;
    String passwordHash;
    SubscriptionPlan subscriptionPlan;
    LocalDate subscriptionExpiry;
    String avatarUrl;
    AccountStatus accountStatus;
    List<Integer> roles;
}
