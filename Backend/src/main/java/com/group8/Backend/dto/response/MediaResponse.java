package com.group8.Backend.dto.response;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.MediaType;
import com.group8.Backend.entity.SubscriptionPlan;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class MediaResponse {
    int mediaId;
    String title;
    String description;
    Integer releaseYear;
    Integer duration;
    String language;
    String ageRating;
    String posterURL;
    String trailerURL;
    LocalDateTime addedDate;
    Integer viewCount;
    String accessLevel;
    MediaType mediaType;
    List<GenreResponse> genres;
    List<ActorResponse> actors;
    List<DirectorResponse> directors;
    Set<SeasonResponse> seasons;

}
