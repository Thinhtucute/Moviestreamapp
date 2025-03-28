package com.group8.Backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class EpisodeResponse {
    int episodeId;
    int episodeNumber;
    String title;
    String description;
    Integer duration;
    LocalDate releaseDate;
}
