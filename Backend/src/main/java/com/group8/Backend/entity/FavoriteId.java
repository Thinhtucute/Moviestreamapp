package com.group8.Backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteId implements Serializable {
    private int userId;
    private int mediaId;
}