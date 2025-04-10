package com.group8.Backend.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "Directors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DirectorID")
    int directorId;

    @Column(name = "DirectorName", nullable = false)
    String directorName;

    @Column(name = "Bio", columnDefinition = "TEXT")
    String bio;
}