package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.MediaType;
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
    public ApiResponse<Void> toggleFavorite(@PathVariable int mediaId, @RequestParam MediaType mediaType) {
        boolean isAdded = favoriteService.toggleFavorite(mediaId, mediaType);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message(isAdded ? "Added to favorites" : "Removed from favorites")
                .build();
    }

    @GetMapping
    public ApiResponse<List<MediaResponse>> getUserFavorites(@RequestParam MediaType mediaType) {
        return ApiResponse.<List<MediaResponse>>builder()
                .code(1000)
                .result(favoriteService.getUserFavorites(mediaType))
                .build();
    }

    @GetMapping("/status/{mediaId}")
    public ApiResponse<Boolean> isFavorite(@PathVariable int mediaId, @RequestParam MediaType mediaType) {
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .result(favoriteService.isFavorite(mediaId, mediaType))
                .build();
    }
}