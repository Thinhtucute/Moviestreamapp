package com.group8.Backend.service;

import com.group8.Backend.dto.request.MediaCreationRequest;
import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.dto.response.PaginatedResponse;
import com.group8.Backend.entity.*;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.mapper.MediaMapper;
import com.group8.Backend.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaService {
    MediaRepository mediaRepository;
    GenreRepository genreRepository;
    ActorRepository actorRepository;
    DirectorRepository directorRepository;
    MediaMapper mediaMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public MediaResponse createMedia(MediaCreationRequest request) {
        if (mediaRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.MEDIA_ALREADY_EXISTS);
        }

        Media media = mediaMapper.toMedia(request);
        media.setAddedDate(LocalDateTime.now());
        media.setViewCount(0);

        // Gán genres
        List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
        if (genres.size() != request.getGenreIds().size()) {
            throw new AppException(ErrorCode.GENRE_NOT_FOUND);
        }
        media.setGenres(new HashSet<>(genres));

        // Gán actors
        List<Actor> actors = actorRepository.findAllById(request.getActorIds());
        if (actors.size() != request.getActorIds().size()) {
            throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
        }
        media.setActors(new HashSet<>(actors));

        // Gán directors
        List<Director> directors = directorRepository.findAllById(request.getDirectorIds());
        if (directors.size() != request.getDirectorIds().size()) {
            throw new AppException(ErrorCode.DIRECTOR_NOT_FOUND);
        }
        media.setDirectors(new HashSet<>(directors));

        media = mediaRepository.save(media);
        return mediaMapper.toMediaResponse(media);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    public MediaResponse updateMedia(int mediaId, MediaUpdateRequest request) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));

        mediaMapper.updateMedia(media, request);

        // Cập nhật genres
        if (request.getGenreIds() != null) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            if (genres.size() != request.getGenreIds().size()) {
                throw new AppException(ErrorCode.GENRE_NOT_FOUND);
            }
            media.setGenres(new HashSet<>(genres));
        }

        // Cập nhật actors
        if (request.getActorIds() != null) {
            List<Actor> actors = actorRepository.findAllById(request.getActorIds());
            if (actors.size() != request.getActorIds().size()) {
                throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
            }
            media.setActors(new HashSet<>(actors));
        }

        // Cập nhật directors
        if (request.getDirectorIds() != null) {
            List<Director> directors = directorRepository.findAllById(request.getDirectorIds());
            if (directors.size() != request.getDirectorIds().size()) {
                throw new AppException(ErrorCode.DIRECTOR_NOT_FOUND);
            }
            media.setDirectors(new HashSet<>(directors));
        }

        media = mediaRepository.save(media);
        return mediaMapper.toMediaResponse(media);
    }

//    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMedia(int mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
        mediaRepository.delete(media);
    }



    public PaginatedResponse<MediaResponse> getAllMedia(
            Integer page, Integer size, String mediaType, String accessLevel, Integer genreId) {
        Pageable pageable = PageRequest.of(page, size);
        MediaType type = mediaType != null ? MediaType.valueOf(mediaType) : null;
        Page<Media> mediaPage = mediaRepository.findAllWithFilters(type, accessLevel, genreId, pageable);

        List<MediaResponse> mediaResponses = mediaPage.getContent().stream()
                .map(mediaMapper::toMediaResponse)
                .toList();

        return PaginatedResponse.<MediaResponse>builder()
                .content(mediaResponses)
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .build();
    }

    public MediaResponse getMediaDetails(int mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
        return mediaMapper.toMediaResponse(media);
    }

    public PaginatedResponse<MediaResponse> searchMedia(
            Integer page, Integer size, String title, String mediaType, Integer releaseYear, Integer genreId) {
        Pageable pageable = PageRequest.of(page, size);
        MediaType type = mediaType != null ? MediaType.valueOf(mediaType) : null;
        Page<Media> mediaPage = mediaRepository.searchMedia(title, type, releaseYear, genreId, pageable);

        List<MediaResponse> mediaResponses = mediaPage.getContent().stream()
                .map(mediaMapper::toMediaResponse)
                .toList();

        return PaginatedResponse.<MediaResponse>builder()
                .content(mediaResponses)
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .build();
    }
}