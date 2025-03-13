package com.group8.Backend.dto.request;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.SubscriptionPlan;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateRequest {
    private String username;
    private String email;
    private String passwordHash;
    private SubscriptionPlan subscriptionPlan;
    private LocalDate subscriptionExpiry;
    private String avatarUrl;
    private AccountStatus accountStatus;
}
