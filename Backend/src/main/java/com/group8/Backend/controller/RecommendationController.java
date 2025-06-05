package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.service.RecommendationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RecommendationController {
    
    RecommendationService recommendationService;
    
    @GetMapping("/clear-cache")
    public ApiResponse<String> clearCache() {
        recommendationService.clearCache();
        return ApiResponse.<String>builder()
                .code(1000)
                .result("Cache cleared successfully")
                .build();
    }
    
    // You could also add other recommendation-related endpoints here
    @GetMapping("/for-user/{userId}")
    public ApiResponse<List<MediaResponse>> getRecommendationsForUser(@PathVariable int userId) {
        List<MediaResponse> recommendations = recommendationService.getRecommendationsForUser(userId);
        return ApiResponse.<List<MediaResponse>>builder()
                .code(1000)
                .result(recommendations)
                .build();
    }
}