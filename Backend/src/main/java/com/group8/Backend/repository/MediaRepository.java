package com.group8.Backend.repository;

import com.group8.Backend.entity.Media;
import com.group8.Backend.entity.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Integer> {
    boolean existsByTitle(String title);

    @Query("SELECT m FROM Media m " +
            "WHERE (:mediaType IS NULL OR m.mediaType = :mediaType) " +
            "AND (:accessLevel IS NULL OR m.accessLevel = :accessLevel) " +
            "AND (:genreId IS NULL OR EXISTS (SELECT g FROM m.genres g WHERE g.genreId = :genreId))")
    Page<Media> findAllWithFilters(
            @Param("mediaType") MediaType mediaType,
            @Param("accessLevel") String accessLevel,
            @Param("genreId") Integer genreId,
            Pageable pageable);

    @Query("SELECT m FROM Media m " +
            "WHERE (:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
            "AND (:mediaType IS NULL OR m.mediaType = :mediaType) " +
            "AND (:releaseYear IS NULL OR m.releaseYear = :releaseYear) " +
            "AND (:genreId IS NULL OR EXISTS (SELECT g FROM m.genres g WHERE g.genreId = :genreId))" +
            "AND (:genreName IS NULL OR EXISTS (SELECT g FROM m.genres g WHERE LOWER(g.genreName) LIKE LOWER(CONCAT('%', :genreName, '%'))))")

    Page<Media> searchMedia(
            @Param("title") String title,
            @Param("mediaType") MediaType mediaType,
            @Param("releaseYear") Integer releaseYear,
            @Param("genreId") Integer genreId,
            @Param("genreName") String genreName,
            Pageable pageable);
}