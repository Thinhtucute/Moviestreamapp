package com.group8.Backend.repository;

import com.group8.Backend.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Integer> {
    Optional<Episode> findByEpisodeIdAndMediaId(int episodeId, int mediaId);

    Optional<Episode> findByMediaIdAndSeasonAndEpisodeNumber(int mediaId, String season, int episodeNumber);

    List<Episode> findByMediaId(int mediaId);

    void deleteByMediaId(int mediaId);
}
