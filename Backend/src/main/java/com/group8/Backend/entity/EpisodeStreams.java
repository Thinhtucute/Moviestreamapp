package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "EpisodeStreams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EpisodeStreams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StreamID")
    int streamId;

    @Column(name = "EpisodeID")
    int episodeId;

    @Column(name = "StreamURL")
    String streamURL;

    @Column(name = "Quality")
    String quality;

    @Column(name = "FileSize")
    Long fileSize;
}
