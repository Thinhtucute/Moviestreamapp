package com.group8.Backend.dto.request;

import com.group8.Backend.entity.AccountStatus;
import com.group8.Backend.entity.MediaType;
import com.group8.Backend.entity.SubscriptionPlan;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaCreationRequest {
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
