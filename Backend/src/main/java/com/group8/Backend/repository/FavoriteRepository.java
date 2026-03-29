package com.group8.Backend.repository;

import com.group8.Backend.entity.Favorite;
import com.group8.Backend.entity.FavoriteId;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findByUserIdAndMediaType(int userId, MediaType mediaType);
    
    boolean existsByUserIdAndMediaIdAndMediaType(int userId, int mediaId, MediaType mediaType);
    
    void deleteByUserIdAndMediaIdAndMediaType(int userId, int mediaId, MediaType mediaType);
    
    @Query("SELECT f.mediaId FROM Favorite f WHERE f.userId = :userId AND f.mediaType = :mediaType")
    List<Integer> findMediaIdsByUserIdAndMediaType(@Param("userId") int userId, @Param("mediaType") MediaType mediaType);
}