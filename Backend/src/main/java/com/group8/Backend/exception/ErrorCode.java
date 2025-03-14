package com.group8.Backend.exception;

import lombok.Getter;

@Getter
public enum ErrorCode
{
    EMAIL_ALREADY_EXISTS(1001, "Email existed"),
    USER_NOT_EXISTS(1002, "User not exists"),
    UNAUTHENTICATED(1003, "Unauthenticated"),
    ;
    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
