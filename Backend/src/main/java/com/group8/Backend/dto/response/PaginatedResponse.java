package com.group8.Backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaginatedResponse<T> {
    List<T> content;
    int page;
    int size;
    long totalElements;
    int totalPages;
}