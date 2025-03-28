package com.group8.Backend.dto.response;

import com.group8.Backend.entity.MediaType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)

public class GenreResponse {
    int genreId;
    String genreName;
}
