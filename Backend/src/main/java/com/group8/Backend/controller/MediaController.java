package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.request.MediaCreationRequest;
import com.group8.Backend.dto.request.TmdbImportRequest;
import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.dto.response.PaginatedResponse;
import com.group8.Backend.entity.MediaType;
import com.group8.Backend.service.MediaService;
import com.group8.Backend.service.TmdbImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;
        private final TmdbImportService tmdbImportService;

        @PostMapping("/import/tmdb")
        public ApiResponse<MediaResponse> importFromTmdb(@RequestBody TmdbImportRequest request) {
                return ApiResponse.<MediaResponse>builder()
                                .code(1000)
                                .result(tmdbImportService.importFromTmdb(request))
                                .build();
        }

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
                        @RequestParam MediaType mediaType,
            @RequestBody MediaUpdateRequest request) {
        return ApiResponse.<MediaResponse>builder()
                .code(1000)
                                .result(mediaService.updateMedia(mediaId, mediaType, request))
                .build();
    }

    @DeleteMapping("/{mediaId}")
        public ApiResponse<Void> deleteMedia(@PathVariable int mediaId, @RequestParam MediaType mediaType) {
                mediaService.deleteMedia(mediaId, mediaType);
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
        public ApiResponse<MediaResponse> getMediaDetails(@PathVariable int mediaId, @RequestParam MediaType mediaType) {
        return ApiResponse.<MediaResponse>builder()
                .code(1000)
                                .result(mediaService.getMediaDetails(mediaId, mediaType))
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
            @RequestParam(required = false) String genreName) {
        return ApiResponse.<PaginatedResponse<MediaResponse>>builder()
                .code(1000)
                .result(mediaService.searchMedia(page, size, title, mediaType, releaseYear, genreId, genreName))
                .build();
    }

}


