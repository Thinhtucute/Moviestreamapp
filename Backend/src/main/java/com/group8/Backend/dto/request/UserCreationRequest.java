package com.group8.Backend.dto.request;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.SubscriptionPlan;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;


@Data
@Builder
public class UserCreationRequest {
    private String username;
    @Email(message = "Invalid email")
    private String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String passwordHash;
    private String avatarURL;
    private SubscriptionPlan subscriptionPlan;
    private AccountStatus accountStatus;


}
