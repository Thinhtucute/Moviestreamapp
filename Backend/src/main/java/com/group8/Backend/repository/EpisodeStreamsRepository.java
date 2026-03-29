package com.group8.Backend.repository;

import com.group8.Backend.entity.EpisodeStreams;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeStreamsRepository extends JpaRepository<EpisodeStreams, Integer> {
    List<EpisodeStreams> findByEpisodeId(int episodeId);
}
