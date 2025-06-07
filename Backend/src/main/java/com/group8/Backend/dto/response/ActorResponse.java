package com.group8.Backend.dto.response;

import com.group8.Backend.entity.Media;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ActorResponse {
     int actorId;
     String actorName;
     String bio;
     String birthdate;
     String profileImageURL;
}
