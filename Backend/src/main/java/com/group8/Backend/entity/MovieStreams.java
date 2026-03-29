package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "MovieStreams")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieStreams {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StreamID")
    int streamId;

    @Column(name = "MediaID")
    int mediaId;

    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;

    @Column(name = "StreamURL")
    String streamURL;

    @Column(name = "Quality")
    String quality;

    @Column(name = "FileSize")
    Long fileSize;
}
