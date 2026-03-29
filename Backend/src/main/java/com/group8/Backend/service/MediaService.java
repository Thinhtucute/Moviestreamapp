package com.group8.Backend.service;

import com.group8.Backend.dto.request.MediaCreationRequest;
import com.group8.Backend.dto.request.MediaUpdateRequest;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.dto.response.PaginatedResponse;
import com.group8.Backend.entity.*;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.exception.ResourceNotFoundException;
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
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MediaService {
    MediaRepository mediaRepository;
    EpisodeRepository episodeRepository;
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

        List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
        if (genres.size() != request.getGenreIds().size()) {
            throw new AppException(ErrorCode.GENRE_NOT_FOUND);
        }
        media.setGenres(new HashSet<>(genres));

        List<Actor> actors = actorRepository.findAllById(request.getActorIds());
        if (actors.size() != request.getActorIds().size()) {
            throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
        }
        media.setActors(new HashSet<>(actors));

        List<Director> directors = directorRepository.findAllById(request.getDirectorIds());
        if (directors.size() != request.getDirectorIds().size()) {
            throw new AppException(ErrorCode.DIRECTOR_NOT_FOUND);
        }
        media.setDirectors(new HashSet<>(directors));

        media = mediaRepository.save(media);
        return mediaMapper.toMediaResponse(media);
    }

    // @PreAuthorize("hasRole('ADMIN')")
    public MediaResponse updateMedia(int mediaId, MediaUpdateRequest request) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));

        mediaMapper.updateMedia(media, request);

        if (request.getGenreIds() != null) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            if (genres.size() != request.getGenreIds().size()) {
                throw new AppException(ErrorCode.GENRE_NOT_FOUND);
            }
            media.setGenres(new HashSet<>(genres));
        }

        if (request.getActorIds() != null) {
            List<Actor> actors = actorRepository.findAllById(request.getActorIds());
            if (actors.size() != request.getActorIds().size()) {
                throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
            }
            media.setActors(new HashSet<>(actors));
        }

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

    // Compatibility overload for callers that pass media type.
    public MediaResponse updateMedia(int mediaId, MediaType mediaType, MediaUpdateRequest request) {
        Media media = getMediaByIdAndType(mediaId, mediaType);

        mediaMapper.updateMedia(media, request);

        if (request.getGenreIds() != null) {
            List<Genre> genres = genreRepository.findAllById(request.getGenreIds());
            if (genres.size() != request.getGenreIds().size()) {
                throw new AppException(ErrorCode.GENRE_NOT_FOUND);
            }
            media.setGenres(new HashSet<>(genres));
        }

        if (request.getActorIds() != null) {
            List<Actor> actors = actorRepository.findAllById(request.getActorIds());
            if (actors.size() != request.getActorIds().size()) {
                throw new AppException(ErrorCode.ACTOR_NOT_FOUND);
            }
            media.setActors(new HashSet<>(actors));
        }

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

    // @PreAuthorize("hasRole('ADMIN')")
    public void deleteMedia(int mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
        mediaRepository.delete(media);
    }

    // Compatibility overload for callers that pass media type.
    public void deleteMedia(int mediaId, MediaType mediaType) {
        Media media = getMediaByIdAndType(mediaId, mediaType);
        mediaRepository.delete(media);
    }

    public PaginatedResponse<MediaResponse> getAllMedia(
            Integer page, Integer size, String mediaType, String accessLevel, Integer genreId) {
        Pageable pageable = PageRequest.of(page, size);
        MediaType type = parseMediaType(mediaType);
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

    // Compatibility overload for callers that pass media type.
    public MediaResponse getMediaDetails(int mediaId, MediaType mediaType) {
        Media media = getMediaByIdAndType(mediaId, mediaType);
        return mediaMapper.toMediaResponse(media);
    }

    /**
     * Return Media entity (used by controllers/services that need the entity object).
     */
    public Media findEntityById(int mediaId) {
        return mediaRepository.findById(mediaId)
                .orElseThrow(() -> new AppException(ErrorCode.MEDIA_NOT_FOUND));
    }

    // Compatibility overload for callers that pass media type.
    public Media findEntityById(int mediaId, MediaType mediaType) {
        return getMediaByIdAndType(mediaId, mediaType);
    }

    public String getExternalUrl(Integer mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("Media not found with id: " + mediaId));

        if (media.getStreamURL() == null || media.getStreamURL().isEmpty()) {
            throw new IllegalStateException("No streaming URL available for media id: " + mediaId);
        }

        return media.getStreamURL();
    }

    // Compatibility overload for callers that pass media type.
    public String getExternalUrl(Integer mediaId, MediaType mediaType) {
        Media media = getMediaByIdAndType(mediaId, mediaType);

        if (media.getStreamURL() == null || media.getStreamURL().isEmpty()) {
            throw new IllegalStateException("No streaming URL available for media id: " + mediaId + " and type: " + mediaType);
        }

        return media.getStreamURL();
    }

    public String getEpisodeExternalUrl(Integer mediaId, Integer episodeId) {
        Episode episode = episodeRepository.findByEpisodeIdAndMediaId(episodeId, mediaId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Episode not found with id: " + episodeId + " for media id: " + mediaId));

        if (episode.getStreamURL() == null || episode.getStreamURL().isBlank()) {
            throw new IllegalStateException("No streaming URL available for episode id: " + episodeId);
        }

        return episode.getStreamURL();
    }

    public PaginatedResponse<MediaResponse> searchMedia(
            Integer page, Integer size, String title, String mediaType, Integer releaseYear, Integer genreId,
            String genreName) {
        Pageable pageable = PageRequest.of(page, size);
        MediaType type = parseMediaType(mediaType);
        Page<Media> mediaPage = mediaRepository.searchMedia(title, type, releaseYear, genreId, genreName, pageable);

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

    private MediaType parseMediaType(String mediaType) {
        if (mediaType == null || mediaType.isBlank()) {
            return null;
        }

        return MediaType.fromValue(mediaType);
    }

    private Media getMediaByIdAndType(int mediaId, MediaType mediaType) {
        Optional<Media> media = mediaRepository.findByMediaIdAndMediaType((long) mediaId, mediaType);
        if (media.isEmpty()) {
            throw new ResourceNotFoundException("Media not found with id: " + mediaId + " and type: " + mediaType);
        }
        return media.get();
    }
}