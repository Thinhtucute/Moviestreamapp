package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "Episodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Episode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EpisodeID")
    int episodeId;

    @ManyToOne
    @JoinColumn(name = "SeasonID", nullable = false)
    Season season;

    @Column(name = "EpisodeNumber", nullable = false)
    int episodeNumber;

    @Column(name = "Title", nullable = false)
    String title;

    @Column(name = "Description")
    String description;

    @Column(name = "Duration")
    Integer duration;

    @Column(name = "ReleaseDate")
    LocalDate releaseDate;
}