package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "Favorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(FavoriteId.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Favorite {
    @Id
    @Column(name = "UserID")
    int userId;
    
    @Id
    @Column(name = "MediaID")
    int mediaId;
    
    @Id
    @Column(name = "MediaType")
    @Convert(converter = MediaTypeConverter.class)
    MediaType mediaType;
    
    @Column(name = "AddedDate")
    LocalDateTime addedDate;
}