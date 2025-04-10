package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Media")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MediaID")
    int mediaId;

    @Column(name = "Title", nullable = false)
    String title;

    @Column(name = "Description", columnDefinition = "TEXT") // Hoặc @Column(length = 500)
    String description;

    @Column(name = "ReleaseYear")
    Integer releaseYear;

    @Column(name = "Duration")
    Integer duration;

    @Column(name = "Language")
    String language;

    @Column(name = "AgeRating")
    String ageRating;

    @Column(name = "PosterURL")
    String posterURL;

    @Column(name = "TrailerURL")
    String trailerURL;

    @Column(name = "AddedDate")
    LocalDateTime addedDate;

    @Column(name = "ViewCount")
    Integer viewCount;

    @Column(name = "AccessLevel")
    String accessLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "MediaType", nullable = false)
    MediaType mediaType;

    @ManyToMany
    @JoinTable(
            name = "MediaGenres",
            joinColumns = @JoinColumn(name = "MediaID"),
            inverseJoinColumns = @JoinColumn(name = "GenreID")
    )
    Set<Genre> genres = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "MediaActors",
            joinColumns = @JoinColumn(name = "MediaID"),
            inverseJoinColumns = @JoinColumn(name = "ActorID")
    )
    Set<Actor> actors = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "MediaDirectors",
            joinColumns = @JoinColumn(name = "MediaID"),
            inverseJoinColumns = @JoinColumn(name = "DirectorID")
    )
    Set<Director> directors = new HashSet<>();

    @OneToMany(mappedBy = "mediaId", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Episode> episodes = new HashSet<>();
}