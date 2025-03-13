package com.group8.Backend.dto.request;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.SubscriptionPlan;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String username;
    @Email(message = "Invalid email")
    String email;
    @Size(min = 8, message = "Password must be at least 8 characters")
     String passwordHash;
     String avatarURL;
     SubscriptionPlan subscriptionPlan;
     AccountStatus accountStatus;
}
