package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RatingID")
    int ratingId;

    @Column(name = "UserID")
    Integer userId;

    @Column(name = "MediaID")
    Integer mediaId;

    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;

    @Column(name = "EpisodeID")
    Integer episodeId;

    @Column(name = "RatingValue")
    Byte ratingValue;

    @Column(name = "Comment", columnDefinition = "TEXT")
    String comment;

    @Column(name = "RatingDate")
    LocalDateTime ratingDate;
}
