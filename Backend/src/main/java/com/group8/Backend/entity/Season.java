package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Seasons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeasonID")
    int seasonId;

    @ManyToOne
    @JoinColumn(name = "MediaID", nullable = false)
    Media media;

    @Column(name = "SeasonNumber", nullable = false)
    int seasonNumber;

    @Column(name = "Description")
    String description;

    @Column(name = "ReleaseDate")
    LocalDate releaseDate;

    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Episode> episodes = new HashSet<>();
}