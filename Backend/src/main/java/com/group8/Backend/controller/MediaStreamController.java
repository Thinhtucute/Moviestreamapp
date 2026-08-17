package com.group8.Backend.controller;

import com.group8.Backend.dto.response.StreamResponse;
import com.group8.Backend.entity.MediaType;
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
    public ResponseEntity<StreamResponse> getStreamingUrl(@PathVariable Integer mediaId, @RequestParam MediaType mediaType) {
        log.info("Request to get streaming URL for media: {} type: {}", mediaId, mediaType);
        String url = mediaService.getExternalUrl(mediaId, mediaType);
        return ResponseEntity.ok(new StreamResponse(url));
    }

    @GetMapping("/{mediaId}/episode/{episodeId}")
    public ResponseEntity<StreamResponse> getEpisodeStreamingUrl(
            @PathVariable Integer mediaId,
            @PathVariable Integer episodeId,
            @RequestParam MediaType mediaType) {
        log.info("Request to get episode streaming URL for media: {} episode: {} type: {}", mediaId, episodeId, mediaType);

        if (mediaType != MediaType.Tv) {
            throw new IllegalArgumentException("Episode streaming is only supported for tv media type");
        }

        String url = mediaService.getEpisodeExternalUrl(mediaId, episodeId);
        return ResponseEntity.ok(new StreamResponse(url));
    }

    @GetMapping("/{mediaId}/season/{season}/episode/{episodeNumber}")
    public ResponseEntity<StreamResponse> getEpisodeStreamingUrlBySeasonAndEpisode(
            @PathVariable Integer mediaId,
            @PathVariable String season,
            @PathVariable Integer episodeNumber,
            @RequestParam MediaType mediaType) {
        log.info(
                "Request to get episode streaming URL for media: {} season: {} episode: {} type: {}",
                mediaId,
                season,
                episodeNumber,
                mediaType);

        if (mediaType != MediaType.Tv) {
            throw new IllegalArgumentException("Episode streaming is only supported for tv media type");
        }

        String url = mediaService.getEpisodeExternalUrl(mediaId, season, episodeNumber);
        return ResponseEntity.ok(new StreamResponse(url));
    }
}