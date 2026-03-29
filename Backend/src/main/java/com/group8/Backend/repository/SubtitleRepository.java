package com.group8.Backend.repository;

import com.group8.Backend.entity.Subtitle;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtitleRepository extends JpaRepository<Subtitle, Integer> {
    List<Subtitle> findByMediaIdAndMediaType(int mediaId, MediaType mediaType);
    List<Subtitle> findByEpisodeId(int episodeId);
}

