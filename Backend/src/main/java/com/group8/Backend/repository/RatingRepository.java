package com.group8.Backend.repository;

import com.group8.Backend.entity.Rating;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByMediaIdAndMediaType(int mediaId, MediaType mediaType);
    List<Rating> findByUserIdAndMediaIdAndMediaType(int userId, int mediaId, MediaType mediaType);
}
