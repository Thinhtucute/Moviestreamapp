package com.group8.Backend.repository;

import com.group8.Backend.entity.MediaViews;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaViewsRepository extends JpaRepository<MediaViews, Integer> {
    List<MediaViews> findByMediaIdAndMediaType(int mediaId, MediaType mediaType);
    List<MediaViews> findByEpisodeId(int episodeId);
}
