package com.group8.Backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum MediaType {
    Movie("movie"),
    Tv("tv");

    private final String dbValue;

    MediaType(String dbValue) {
        this.dbValue = dbValue;
    }

    @JsonValue
    public String getDbValue() {
        return dbValue;
    }

    @JsonCreator
    public static MediaType fromValue(String rawValue) {
        if (rawValue == null) {
            return null;
        }

        String normalized = rawValue.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "movie" -> Movie;
            case "tv" -> Tv;
            default -> throw new IllegalArgumentException("Unsupported media type: " + rawValue);
        };
    }
}
