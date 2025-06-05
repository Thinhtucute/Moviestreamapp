package com.group8.Backend.repository;

import com.group8.Backend.entity.Favorite;
import com.group8.Backend.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findByUserId(int userId);
    
    boolean existsByUserIdAndMediaId(int userId, int mediaId);
    
    void deleteByUserIdAndMediaId(int userId, int mediaId);
    
    @Query("SELECT f.mediaId FROM Favorite f WHERE f.userId = :userId")
    List<Integer> findMediaIdsByUserId(@Param("userId") int userId);
}