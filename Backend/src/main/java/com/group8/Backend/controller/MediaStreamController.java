package com.group8.Backend.controller;

import com.group8.Backend.dto.response.StreamResponse;
import com.group8.Backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
@Slf4j
public class MediaStreamController {
    
    private final MediaService mediaService;
    
    @GetMapping("/{mediaId}")
    public ResponseEntity<StreamResponse> getStreamingUrl(@PathVariable Integer mediaId) {
        log.info("Request to get streaming URL for media: {}", mediaId);
        String url = mediaService.getExternalUrl(mediaId);
        return ResponseEntity.ok(new StreamResponse(url));
    }
}