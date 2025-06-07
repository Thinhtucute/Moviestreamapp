package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.ActorRequest;
import com.group8.Backend.dto.response.ActorResponse;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.Actor;
import com.group8.Backend.entity.Media;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ActorMapper {
    
    Actor toEntity(ActorRequest request);

    ActorResponse toResponse(Actor actor);

    @Mapping(target = "actorId", ignore = true)
    void updateActor(@MappingTarget Actor actor, ActorRequest request);

    MediaResponse toMediaResponse(Media media);

} 