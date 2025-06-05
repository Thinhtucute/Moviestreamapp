package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorites")
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
    
    @Column(name = "AddedDate")
    LocalDateTime addedDate;
}