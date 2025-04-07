package com.group8.Backend.mapper;

import com.group8.Backend.dto.request.MediaCreationRequest;
//import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.response.*;
import com.group8.Backend.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MediaMapper {
    Media toMedia(MediaCreationRequest request);

    @Mapping(target = "genres", source = "genres")
    @Mapping(target = "actors", source = "actors")
    @Mapping(target = "directors", source = "directors")
    @Mapping(target = "seasons", source = "seasons")
    MediaResponse toMediaResponse(Media media);

    @Mapping(target = "mediaId", ignore = true)
    @Mapping(target = "genres", ignore = true)
    @Mapping(target = "actors", ignore = true)
    @Mapping(target = "directors", ignore = true)
    @Mapping(target = "seasons", ignore = true)
    void updateMedia(@MappingTarget Media media, MediaUpdateRequest request);

    GenreResponse toGenreResponse(Genre genre);

    ActorResponse toActorResponse(Actor actor);

    DirectorResponse toDirectorResponse(Director director);

    SeasonResponse toSeasonResponse(Season season);

    EpisodeResponse toEpisodeResponse(Episode episode);
}