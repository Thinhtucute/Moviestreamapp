package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.request.MediaCreationRequest;
import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.dto.response.PaginatedResponse;
import com.group8.Backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    @PostMapping
    public ApiResponse<MediaResponse> createMedia(@RequestBody MediaCreationRequest request) {
        return ApiResponse.<MediaResponse>builder()
                .code(1000)
                .result(mediaService.createMedia(request))
                .build();
    }

    @PutMapping("/{mediaId}")
    public ApiResponse<MediaResponse> updateMedia(
            @PathVariable int mediaId,
            @RequestBody MediaUpdateRequest request) {
        return ApiResponse.<MediaResponse>builder()
                .code(1000)
                .result(mediaService.updateMedia(mediaId, request))
                .build();
    }

    @DeleteMapping("/{mediaId}")
    public ApiResponse<Void> deleteMedia(@PathVariable int mediaId) {
        mediaService.deleteMedia(mediaId);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Media deleted successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<PaginatedResponse<MediaResponse>> getAllMedia(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String mediaType,
            @RequestParam(required = false) String accessLevel,
            @RequestParam(required = false) Integer genreId) {
        return ApiResponse.<PaginatedResponse<MediaResponse>>builder()
                .code(1000)
                .result(mediaService.getAllMedia(page, size, mediaType, accessLevel, genreId))
                .build();
    }

    @GetMapping("/{mediaId}")
    public ApiResponse<MediaResponse> getMediaDetails(@PathVariable int mediaId) {
        return ApiResponse.<MediaResponse>builder()
                .code(1000)
                .result(mediaService.getMediaDetails(mediaId))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PaginatedResponse<MediaResponse>> searchMedia(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String mediaType,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) Integer genreId,
            @RequestParam(required = false) String genreName) { // Added genreName parameter
        return ApiResponse.<PaginatedResponse<MediaResponse>>builder()
                .code(1000)
                .result(mediaService.searchMedia(page, size, title, mediaType, releaseYear, genreId, genreName))
                .build();
    }

}


