package com.group8.Backend.controller;

import com.group8.Backend.dto.response.ViewingHistoryResponse;
import com.group8.Backend.service.ViewingHistoryService;
import com.group8.Backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/history")
public class ViewingHistoryController {
    private final ViewingHistoryService historyService;
    private final UserService userService; // still available if needed elsewhere

    public ViewingHistoryController(ViewingHistoryService historyService, UserService userService) {
        this.historyService = historyService;
        this.userService = userService;
    }

    @PostMapping("/view/{mediaId}")
    public void addView(@PathVariable Long mediaId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        historyService.addOrUpdateByUsernameAndMediaId(username, mediaId);
    }

    @GetMapping
    public List<ViewingHistoryResponse> getHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        var list = historyService.getForUsername(username);

        return list.stream().map(vh -> {
            ViewingHistoryResponse r = new ViewingHistoryResponse();
            r.setMediaId(vh.getMedia().getMediaId());
            r.setTitle(vh.getMedia().getTitle());
            r.setPosterURL(vh.getMedia().getPosterURL());
            r.setMediaType(vh.getMedia().getMediaType() != null ? vh.getMedia().getMediaType().name() : null);
            r.setLastViewed(vh.getLastViewed());
            return r;
        }).collect(Collectors.toList());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearHistory() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        historyService.clearForUsername(username);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long mediaId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        historyService.deleteEntryByUsernameAndMediaId(username, mediaId);
        return ResponseEntity.noContent().build();
    }
}