package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "WatchHistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WatchHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HistoryID")
    int historyId;

    @Column(name = "UserID")
    Integer userId;

    @Column(name = "MediaID")
    Integer mediaId;

    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;

    @Column(name = "EpisodeID")
    Integer episodeId;

    @Column(name = "WatchDate")
    LocalDateTime watchDate;

    @Column(name = "Progress")
    Integer progress;
}
