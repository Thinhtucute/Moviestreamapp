package com.group8.Backend.dto.request;

import com.group8.Backend.entity.MediaType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaUpdateRequest {
    String title;
    String description;
    Integer releaseYear;
    Integer duration;
    String language;
    String ageRating;
    String posterURL;
    String trailerURL;
    String accessLevel;
    MediaType mediaType;
    List<Integer> genreIds;
    List<Integer> actorIds;
    List<Integer> directorIds;
}