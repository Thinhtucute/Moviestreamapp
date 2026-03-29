package com.group8.Backend.repository;

import com.group8.Backend.entity.MovieStreams;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieStreamsRepository extends JpaRepository<MovieStreams, Integer> {
    List<MovieStreams> findByMediaIdAndMediaType(int mediaId, MediaType mediaType);
}

