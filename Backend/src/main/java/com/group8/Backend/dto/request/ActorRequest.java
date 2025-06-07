package com.group8.Backend.dto.request;

import lombok.Data;

@Data
public class ActorRequest {
    private String actorName;
    private String bio;
    private String birthdate;
    private String profileImageURL;
} 