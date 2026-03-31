package com.group8.Backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.group8.Backend.dto.request.TmdbImportRequest;
import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.*;
import com.group8.Backend.mapper.MediaMapper;
import com.group8.Backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TmdbImportService {
    private static final String TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    private static final int MAX_CAST = 15;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_DATE;

    @Value("${tmdb.api.key:}")
    private String tmdbApiKey;

    @Value("${tmdb.api.base-url:https://api.themoviedb.org/3}")
    private String tmdbBaseUrl;

    private final MediaRepository mediaRepository;
    private final GenreRepository genreRepository;
    private final ActorRepository actorRepository;
    private final DirectorRepository directorRepository;
    private final EpisodeRepository episodeRepository;
    private final MediaMapper mediaMapper;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public MediaResponse importFromTmdb(TmdbImportRequest request) {
        validateRequest(request);

        int tmdbId = request.getTmdbId();
        MediaType mediaType = request.getMediaType();

        // Fetch TMDB details with credits
        String endpoint = mediaType == MediaType.Movie 
            ? String.format("/movie/%d?append_to_response=credits", tmdbId)
            : String.format("/tv/%d?append_to_response=credits", tmdbId);
        
        JsonNode tmdbData = fetchFromTmdb(endpoint);
        if (tmdbData == null || tmdbData.path("id").isMissingNode() || tmdbData.path("id").isNull()) {
            throw new IllegalStateException("Unable to fetch TMDB data for ID: " + tmdbId);
        }

        // Find or create Media entity
        Media media = mediaRepository
                .findByMediaIdAndMediaType((long) tmdbId, mediaType)
                .orElseGet(() -> createNewMedia(tmdbId, mediaType));

        // Map TMDB data to Media entity
        mapTmdbDataToMedia(media, tmdbData, request);

        // Resolve and set relationships
        media.setGenres(resolveGenres(tmdbData.get("genres")));
        media.setActors(resolveCast(tmdbData.path("credits").path("cast")));
        media.setDirectors(resolveCrew(tmdbData.path("credits").path("crew")));

        // Save media with relationships
        Media savedMedia = mediaRepository.saveAndFlush(media);

        // Handle episodes for TV series
        boolean includeEpisodes = request.getIncludeEpisodes() == null || request.getIncludeEpisodes();
        if (mediaType == MediaType.Tv && includeEpisodes) {
            syncEpisodes(savedMedia, tmdbId, request);
        }

        // Refresh and return
        Media refreshed = mediaRepository
                .findByMediaIdAndMediaType(savedMedia.getMediaId(), savedMedia.getMediaType())
                .orElse(savedMedia);
        
        return mediaMapper.toMediaResponse(refreshed);
    }

    private void validateRequest(TmdbImportRequest request) {
        if (request == null || request.getTmdbId() == null || request.getTmdbId() <= 0) {
            throw new IllegalArgumentException("TMDB ID must be a positive integer");
        }
        if (request.getMediaType() == null) {
            throw new IllegalArgumentException("Media type is required (Movie or Tv)");
        }
        if (!StringUtils.hasText(tmdbApiKey)) {
            throw new IllegalStateException("TMDB_API_KEY not configured");
        }
    }

    private Media createNewMedia(int tmdbId, MediaType mediaType) {
        Media media = new Media();
        media.setMediaId((long) tmdbId);
        media.setMediaType(mediaType);
        media.setAddedDate(LocalDateTime.now());
        media.setViewCount(0);
        return media;
    }

    private void mapTmdbDataToMedia(Media media, JsonNode tmdbData, TmdbImportRequest request) {
        // Title
        String title = getStringValue(tmdbData, 
            media.getMediaType() == MediaType.Movie ? "title" : "name");
        media.setTitle(StringUtils.hasText(title) ? title : "Unknown");

        // Description
        String description = getStringValue(tmdbData, "overview");
        media.setDescription(StringUtils.hasText(description) ? description : "");

        // Release Year
        String releaseDate = getStringValue(tmdbData, 
            media.getMediaType() == MediaType.Movie ? "release_date" : "first_air_date");
        if (StringUtils.hasText(releaseDate) && releaseDate.length() >= 4) {
            try {
                media.setReleaseYear(Integer.parseInt(releaseDate.substring(0, 4)));
            } catch (NumberFormatException e) {
                log.warn("Failed to parse release date: {}", releaseDate);
            }
        }

        // Duration (runtime for movies, default 45 for TV)
        if (media.getMediaType() == MediaType.Movie) {
            int runtime = getIntValue(tmdbData, "runtime");
            if (runtime > 0) {
                media.setDuration(runtime);
            }
        } else {
            media.setDuration(45); // Default TV episode duration
        }

        // Language
        String language = getStringValue(tmdbData, "original_language");
        media.setLanguage(StringUtils.hasText(language) ? language.toUpperCase() : "EN");

        // Age Rating (content rating for TV, certification for movies)
        String ageRating = "PG";
        JsonNode releases = tmdbData.path("releases");
        if (releases.isObject()) {
            JsonNode usRelease = releases.path("results");
            if (usRelease.isArray()) {
                for (JsonNode release : usRelease) {
                    if ("US".equals(getStringValue(release, "iso_3166_1"))) {
                        ageRating = getStringValue(release, "certification");
                        break;
                    }
                }
            }
        }
        media.setAgeRating(StringUtils.hasText(ageRating) ? ageRating : "PG");

        // Poster & Backdrop URLs
        String posterPath = getStringValue(tmdbData, "poster_path");
        if (StringUtils.hasText(posterPath)) {
            media.setPosterURL(TMDB_IMAGE_BASE_URL + posterPath);
        }

        String backdropPath = getStringValue(tmdbData, "backdrop_path");
        if (StringUtils.hasText(backdropPath)) {
            media.setBackdropURL(TMDB_IMAGE_BASE_URL + backdropPath);
        }

        if (media.getMediaType() == MediaType.Movie) {
            media.setStreamURL("https://vidking.net/embed/movie/" + media.getMediaId() + "?autoPlay=true");
        } else {
            media.setStreamURL(null);
        }

        // AccessLevel (from request or default)
        media.setAccessLevel(StringUtils.hasText(request.getAccessLevel()) 
            ? request.getAccessLevel() : "PUBLIC");
    }

    private Set<Genre> resolveGenres(JsonNode genresNode) {
        Set<Genre> genres = new HashSet<>();
        if (genresNode == null || !genresNode.isArray()) {
            return genres;
        }

        for (JsonNode genreNode : genresNode) {
            String genreName = getStringValue(genreNode, "name");
            if (!StringUtils.hasText(genreName)) continue;

            Genre genre = genreRepository
                    .findByGenreNameIgnoreCase(genreName)
                    .orElseGet(() -> {
                        Genre newGenre = new Genre();
                        newGenre.setGenreName(genreName);
                        return genreRepository.save(newGenre);
                    });
            genres.add(genre);
        }

        return genres;
    }

    private Set<Actor> resolveCast(JsonNode castNode) {
        Set<Actor> actors = new HashSet<>();
        if (castNode == null || !castNode.isArray()) {
            return actors;
        }

        int count = 0;
        for (JsonNode castMember : castNode) {
            if (count >= MAX_CAST) break;

            String actorName = getStringValue(castMember, "name");
            if (!StringUtils.hasText(actorName)) continue;

            Actor actor = actorRepository
                    .findFirstByActorNameIgnoreCase(actorName)
                    .orElseGet(() -> {
                        Actor newActor = new Actor();
                        newActor.setActorName(actorName);
                        
                        String profilePath = getStringValue(castMember, "profile_path");
                        if (StringUtils.hasText(profilePath)) {
                            newActor.setProfileImageURL(TMDB_IMAGE_BASE_URL + profilePath);
                        }
                        
                        return actorRepository.save(newActor);
                    });
            actors.add(actor);
            count++;
        }

        return actors;
    }

    private Set<Director> resolveCrew(JsonNode crewNode) {
        Set<Director> directors = new HashSet<>();
        if (crewNode == null || !crewNode.isArray()) {
            return directors;
        }

        for (JsonNode crewMember : crewNode) {
            String job = getStringValue(crewMember, "job");
            if (!"Director".equalsIgnoreCase(job)) continue;

            String directorName = getStringValue(crewMember, "name");
            if (!StringUtils.hasText(directorName)) continue;

            Director director = directorRepository
                    .findFirstByDirectorNameIgnoreCase(directorName)
                    .orElseGet(() -> {
                        Director newDirector = new Director();
                        newDirector.setDirectorName(directorName);
                        return directorRepository.save(newDirector);
                    });
            directors.add(director);
        }

        return directors;
    }

    private void syncEpisodes(Media tvMedia, int tmdbId, TmdbImportRequest request) {
        boolean overwrite = request.getOverwriteEpisodes() != null && request.getOverwriteEpisodes();
        
        if (overwrite) {
            episodeRepository.deleteByMediaId(tmdbId);
        }

        // Fetch TV details to get seasons
        JsonNode tvDetails = fetchFromTmdb("/tv/" + tmdbId);
        if (tvDetails == null) return;

        JsonNode seasonsNode = tvDetails.get("seasons");
        if (seasonsNode == null || !seasonsNode.isArray()) return;

        List<Episode> episodesToSave = new ArrayList<>();

        for (JsonNode seasonNode : seasonsNode) {
            int seasonNumber = getIntValue(seasonNode, "season_number");
            if (seasonNumber < 0) continue; // Skip season 0 (specials) or invalid

            // Fetch season details with episodes
            JsonNode seasonDetails = fetchFromTmdb("/tv/" + tmdbId + "/season/" + seasonNumber);
            if (seasonDetails == null) continue;

            JsonNode episodesNode = seasonDetails.get("episodes");
            if (episodesNode == null || !episodesNode.isArray()) continue;

            for (JsonNode episodeNode : episodesNode) {
                int episodeNumber = getIntValue(episodeNode, "episode_number");
                if (episodeNumber <= 0) continue;

                // Find existing or create new
                Episode episode = episodeRepository
                        .findByMediaIdAndSeasonAndEpisodeNumber(tmdbId, String.valueOf(seasonNumber), episodeNumber)
                        .orElseGet(() -> {
                            Episode newEpisode = new Episode();
                            newEpisode.setMediaId(tmdbId);
                            return newEpisode;
                        });

                episode.setEpisodeNumber(episodeNumber);
                episode.setSeason(String.valueOf(seasonNumber));
                episode.setTitle(getStringValue(episodeNode, "name"));
                episode.setDescription(getStringValue(episodeNode, "overview"));
                episode.setDuration(getIntValue(episodeNode, "runtime"));

                String airDate = getStringValue(episodeNode, "air_date");
                if (StringUtils.hasText(airDate)) {
                    try {
                        episode.setReleaseDate(LocalDate.parse(airDate, DATE_FORMATTER));
                    } catch (Exception e) {
                        log.warn("Failed to parse episode air date: {}", airDate);
                    }
                }

                // Set stream URL
                episode.setStreamURL(String.format("https://vidking.net/embed/tv/%d/%d/%d?autoPlay=true&nextEpisode=true&episodeSelector=true", 
                    tmdbId, seasonNumber, episodeNumber));

                episodesToSave.add(episode);
            }
        }

        if (!episodesToSave.isEmpty()) {
            episodeRepository.saveAll(episodesToSave);
            log.info("Synced {} episodes for TV series {}", episodesToSave.size(), tmdbId);
        }
    }

    private JsonNode fetchFromTmdb(String endpoint) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(tmdbBaseUrl + endpoint)
                    .queryParam("api_key", tmdbApiKey)
                    .queryParam("language", "en-US")
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            return objectMapper.readTree(response);
        } catch (RestClientException e) {
            log.error("TMDB API request failed for endpoint: {}", endpoint, e);
            return null;
        } catch (Exception e) {
            log.error("Failed to parse TMDB response", e);
            return null;
        }
    }

    private String getStringValue(JsonNode node, String fieldName) {
        JsonNode field = node == null ? null : node.path(fieldName);
        if (field == null || field.isMissingNode() || field.isNull()) {
            return null;
        }
        return field.isTextual() ? field.asText() : null;
    }

    private int getIntValue(JsonNode node, String fieldName) {
        JsonNode field = node == null ? null : node.path(fieldName);
        if (field == null || field.isMissingNode() || field.isNull()) {
            return 0;
        }
        return field.isIntegralNumber() ? field.asInt() : 0;
    }
}
