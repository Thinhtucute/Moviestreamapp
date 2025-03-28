package com.group8.Backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class SeasonResponse {
    int seasonId;
    int seasonNumber;
    String description;
    LocalDate releaseDate;
    Set<EpisodeResponse> episodes;
}
