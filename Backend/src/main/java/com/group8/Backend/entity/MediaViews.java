package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "MediaViews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaViews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ViewID")
    int viewId;

    @Column(name = "MediaID")
    Integer mediaId;

    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;

    @Column(name = "EpisodeID")
    Integer episodeId;

    @Column(name = "ViewDate")
    LocalDateTime viewDate;
}
