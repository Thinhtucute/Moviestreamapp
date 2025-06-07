package com.group8.Backend.service;

import com.group8.Backend.dto.request.ActorRequest;
import com.group8.Backend.dto.response.ActorResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.Actor;
import com.group8.Backend.mapper.ActorMapper;
import com.group8.Backend.mapper.MediaMapper;
import com.group8.Backend.repository.ActorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActorService {
    private final ActorRepository actorRepository;
    private final ActorMapper actorMapper;
    private final MediaMapper mediaMapper;

    public List<ActorResponse> getAllActors() {
        return actorRepository.findAll().stream()
                .map(actorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ActorResponse getActorById(int actorId) {
        Actor actor = actorRepository.findById(actorId)
                .orElseThrow(() -> new RuntimeException("Actor not found with id: " + actorId));
        return actorMapper.toResponse(actor);
    }

    @Transactional
    public ActorResponse createActor(ActorRequest request) {
        Actor actor = actorMapper.toEntity(request);
        Actor savedActor = actorRepository.save(actor);
        return actorMapper.toResponse(savedActor);
    }

    @Transactional
    public ActorResponse updateActor(int actorId, ActorRequest request) {
        Actor existingActor = actorRepository.findById(actorId)
                .orElseThrow(() -> new RuntimeException("Actor not found with id: " + actorId));

        actorMapper.updateActor(existingActor, request);
        Actor updatedActor = actorRepository.save(existingActor);
        return actorMapper.toResponse(updatedActor);
    }

    @Transactional
    public void deleteActor(int actorId) {
        if (!actorRepository.existsById(actorId)) {
            throw new RuntimeException("Actor not found with id: " + actorId);
        }
        actorRepository.deleteById(actorId);
    }



    // public List<ActorResponse> searchActors(String keyword) {
    //     return actorRepository.findByNameContainingIgnoreCase(keyword).stream()
    //             .map(actorMapper::toResponse)
    //             .collect(Collectors.toList());
    // }
} 