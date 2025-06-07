package com.group8.Backend.dto.request;

import com.group8.Backend.entity.SubscriptionPlan;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubscriptionUpdateRequest {
    private SubscriptionPlan subscriptionPlan;
    private LocalDate subscriptionExpiry;
} 