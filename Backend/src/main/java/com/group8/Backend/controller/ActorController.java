package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ActorRequest;
import com.group8.Backend.dto.response.ActorResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.service.ActorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actors")
@RequiredArgsConstructor
public class ActorController {
    private final ActorService actorService;

    @GetMapping
    public ResponseEntity<List<ActorResponse>> getAllActors() {
        return ResponseEntity.ok(actorService.getAllActors());
    }

    @GetMapping("/{actorId}")
    public ResponseEntity<ActorResponse> getActorById(@PathVariable int actorId) {
        return ResponseEntity.ok(actorService.getActorById(actorId));
    }

    

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActorResponse> createActor(@RequestBody ActorRequest request) {
        return ResponseEntity.ok(actorService.createActor(request));
    }

    @PutMapping("/{actorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ActorResponse> updateActor(
            @PathVariable int actorId,
            @RequestBody ActorRequest request) {
        return ResponseEntity.ok(actorService.updateActor(actorId, request));
    }

    @DeleteMapping("/{actorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActor(@PathVariable int actorId) {
        actorService.deleteActor(actorId);
        return ResponseEntity.ok().build();
    }

//    @GetMapping("/search")
//    public ResponseEntity<List<ActorResponse>> searchActors(@RequestParam String keyword) {
//        return ResponseEntity.ok(actorService.searchActors(keyword));
//    }
} 