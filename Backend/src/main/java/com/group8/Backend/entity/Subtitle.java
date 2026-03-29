package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Subtitles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Subtitle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SubtitleID")
    int subtitleId;

    @Column(name = "MediaID")
    Integer mediaId;

    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;

    @Column(name = "EpisodeID")
    Integer episodeId;

    @Column(name = "Language")
    String language;

    @Column(name = "SubtitleURL")
    String subtitleURL;
}
