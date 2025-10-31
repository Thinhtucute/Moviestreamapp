package com.group8.Backend.service;

import com.group8.Backend.entity.ViewingHistory;
import com.group8.Backend.entity.User;
import com.group8.Backend.entity.Media;
import com.group8.Backend.repository.ViewingHistoryRepository;
import com.group8.Backend.repository.UserRepository;
import com.group8.Backend.repository.MediaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ViewingHistoryService {
    private final ViewingHistoryRepository repo;
    private final UserRepository userRepository;
    private final MediaRepository mediaRepository;

    public ViewingHistoryService(ViewingHistoryRepository repo, UserRepository userRepository, MediaRepository mediaRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.mediaRepository = mediaRepository;
    }

    public ViewingHistory addOrUpdate(User user, Media media) {
        ViewingHistory vh = repo.findByUserAndMedia(user, media).orElseGet(ViewingHistory::new);
        vh.setUser(user);
        vh.setMedia(media);
        vh.setLastViewed(LocalDateTime.now());
        return repo.save(vh);
    }

    public ViewingHistory addOrUpdateByUsernameAndMediaId(String username, Long mediaId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        Media media = mediaRepository.findById(mediaId.intValue())
                .orElseThrow(() -> new RuntimeException("Media not found: " + mediaId));
        return addOrUpdate(user, media);
    }

    public List<ViewingHistory> getForUser(User user) {
        return repo.findByUserOrderByLastViewedDesc(user);
    }

    public List<ViewingHistory> getForUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return getForUser(user);
    }

    public void deleteEntry(User user, Media media) {
        repo.findByUserAndMedia(user, media).ifPresent(repo::delete);
    }

    public void deleteEntryByUsernameAndMediaId(String username, Long mediaId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        Media media = mediaRepository.findById(mediaId.intValue())
                .orElseThrow(() -> new RuntimeException("Media not found: " + mediaId));
        deleteEntry(user, media);
    }

    public void clearForUser(User user) {
        repo.deleteByUser(user);
    }

    public void clearForUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        clearForUser(user);
    }
}