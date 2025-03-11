package com.group8.Backend.exception;

public enum ErrorCode
{
    EMAIL_ALREADY_EXISTS(1001, "Email existed")
    ;
    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }


    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
