package com.group8.Backend.service;

import com.group8.Backend.dto.response.MediaResponse;
import com.group8.Backend.entity.Favorite;
import com.group8.Backend.entity.Media;
import com.group8.Backend.entity.MediaType;
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

    public int getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByUsername(authentication.getName());
        return user.getUserID();
    }

    @Transactional
    public boolean toggleFavorite(int mediaId, MediaType mediaType) {
        int userId = getCurrentUserId();

        // Check if media exists
        Optional<Media> mediaOptional = mediaRepository.findByMediaIdAndMediaType((long) mediaId, mediaType);
        if (mediaOptional.isEmpty()) {
            throw new AppException(ErrorCode.MEDIA_NOT_FOUND);
        }

        // Check if already favorited
        boolean exists = favoriteRepository.existsByUserIdAndMediaIdAndMediaType(userId, mediaId, mediaType);

        if (exists) {
            // Remove from favorites
            favoriteRepository.deleteByUserIdAndMediaIdAndMediaType(userId, mediaId, mediaType);
            return false;
        } else {
            // Add to favorites
            Favorite favorite = Favorite.builder()
                    .userId(userId)
                    .mediaId(mediaId)
                    .mediaType(mediaType)
                    .addedDate(LocalDateTime.now())
                    .build();
            favoriteRepository.save(favorite);
            return true;
        }
    }

    public List<MediaResponse> getUserFavorites(MediaType mediaType) {
        int userId = getCurrentUserId();
        List<Favorite> favorites = favoriteRepository.findByUserIdAndMediaType(userId, mediaType);

        return favorites.stream()
                .map(favorite -> mediaRepository.findByMediaIdAndMediaType((long) favorite.getMediaId(), favorite.getMediaType()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(mediaMapper::toMediaResponse)
                .collect(Collectors.toList());
    }

    public boolean isFavorite(int mediaId, MediaType mediaType) {
        int userId = getCurrentUserId();
        return favoriteRepository.existsByUserIdAndMediaIdAndMediaType(userId, mediaId, mediaType);
    }
}