package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/{mediaId}")
    public ApiResponse<Void> toggleFavorite(@PathVariable int mediaId) {
        boolean isAdded = favoriteService.toggleFavorite(mediaId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message(isAdded ? "Added to favorites" : "Removed from favorites")
                .build();
    }

    @GetMapping
    public ApiResponse<List<MediaResponse>> getUserFavorites() {
        return ApiResponse.<List<MediaResponse>>builder()
                .code(1000)
                .result(favoriteService.getUserFavorites())
                .build();
    }

    @GetMapping("/status/{mediaId}")
    public ApiResponse<Boolean> isFavorite(@PathVariable int mediaId) {
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .result(favoriteService.isFavorite(mediaId))
                .build();
    }
    
    @GetMapping("/recommendations")
    public ApiResponse<List<MediaResponse>> getRecommendations() {
        return ApiResponse.<List<MediaResponse>>builder()
                .code(1000)
                .result(favoriteService.getRecommendations())
                .build();
    }
}