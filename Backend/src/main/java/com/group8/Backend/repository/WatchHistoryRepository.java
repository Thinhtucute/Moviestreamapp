package com.group8.Backend.repository;

import com.group8.Backend.entity.WatchHistory;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchHistoryRepository extends JpaRepository<WatchHistory, Integer> {
    List<WatchHistory> findByUserIdAndMediaIdAndMediaType(int userId, int mediaId, MediaType mediaType);
    List<WatchHistory> findByMediaIdAndMediaType(int mediaId, MediaType mediaType);
}
