package com.group8.Backend.repository;

import com.group8.Backend.entity.ViewingHistory;
import com.group8.Backend.entity.User;
import com.group8.Backend.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViewingHistoryRepository extends JpaRepository<ViewingHistory, Long> {
    Optional<ViewingHistory> findByUserAndMedia(User user, Media media);
    List<ViewingHistory> findByUserOrderByLastViewedDesc(User user);
    void deleteByUser(User user);
}