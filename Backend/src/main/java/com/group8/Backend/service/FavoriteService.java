package com.group8.Backend.service;

import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.Favorite;
import com.group8.Backend.entity.Media;
import com.group8.Backend.entity.User;
import com.group8.Backend.exception.AppException;
import com.group8.Backend.exception.ErrorCode;
import com.group8.Backend.mapper.MediaMapper;
import com.group8.Backend.repository.FavoriteRepository;
import com.group8.Backend.repository.MediaRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteService {
    FavoriteRepository favoriteRepository;
    MediaRepository mediaRepository;
    UserService userService;
    MediaMapper mediaMapper;
    RecommendationService recommendationService;

    public int getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(authentication.getName());
        return user.getUserID();
    }

    @Transactional
    public boolean toggleFavorite(int mediaId) {
        int userId = getCurrentUserId();

        // Check if media exists
        Optional<Media> mediaOptional = mediaRepository.findById(mediaId);
        if (mediaOptional.isEmpty()) {
            throw new AppException(ErrorCode.MEDIA_NOT_FOUND);
        }

        // Check if already favorited
        boolean exists = favoriteRepository.existsByUserIdAndMediaId(userId, mediaId);

        if (exists) {
            // Remove from favorites
            favoriteRepository.deleteByUserIdAndMediaId(userId, mediaId);
            return false;
        } else {
            // Add to favorites
            Favorite favorite = Favorite.builder()
                    .userId(userId)
                    .mediaId(mediaId)
                    .addedDate(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
            return true;
        }
    }

    public List<MediaResponse> getUserFavorites() {
        int userId = getCurrentUserId();
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);

        List<Media> favoriteMedia = new ArrayList<>();
        for (Favorite favorite : favorites) {
            mediaRepository.findById(favorite.getMediaId())
                    .ifPresent(favoriteMedia::add);
        }

        return favoriteMedia.stream()
                .map(mediaMapper::toMediaResponse)
                .collect(Collectors.toList());
    }

    public boolean isFavorite(int mediaId) {
        int userId = getCurrentUserId();
        return favoriteRepository.existsByUserIdAndMediaId(userId, mediaId);
    }

    public List<MediaResponse> getRecommendations() {
        int userId = getCurrentUserId();
        return recommendationService.getRecommendationsForUser(userId);
    }
}