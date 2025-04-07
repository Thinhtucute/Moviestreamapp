package com.group8.Backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ActorResponse {
    int actorId;
    String actorName;
    String bio;
    LocalDate birthdate;
}
