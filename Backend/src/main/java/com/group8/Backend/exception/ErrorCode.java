package com.group8.Backend.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode
{
    UNCATEGORIZED_EXCEPTION(9999,"Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_ALREADY_EXISTS(1001, "Email existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTS(1002, "User not exists", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1003, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1004, "You do not have permission", HttpStatus.FORBIDDEN),
    MOVIE_ALREADY_EXISTS(1006, "Movie already exists",  HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(1007, "Movie not found",  HttpStatus.NOT_FOUND),
    MEDIA_ALREADY_EXISTS(1008, "Media already exists",  HttpStatus.BAD_REQUEST),
    MEDIA_NOT_FOUND(1009, "Media not found",  HttpStatus.NOT_FOUND),
    GENRE_NOT_FOUND(1010, "Genre not found",  HttpStatus.NOT_FOUND),
    ACTOR_NOT_FOUND(1011, "Actor not found",  HttpStatus.NOT_FOUND),
    DIRECTOR_NOT_FOUND(1012, "Director not found",  HttpStatus.NOT_FOUND),
    TOKEN_EXPIRED(1013,  "Token is expired", HttpStatus.UNAUTHORIZED),
    TOKEN_ALREADY_INVALIDATED(1014,  "Token is already invalidated", HttpStatus.UNAUTHORIZED),
    ;


    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code;
    private String message;
    private HttpStatusCode statusCode;

}
