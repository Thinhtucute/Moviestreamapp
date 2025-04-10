package com.group8.Backend.controller;

import com.group8.Backend.dto.request.*;
import com.group8.Backend.dto.response.AuthenticationResponse;
import com.group8.Backend.dto.response.IntrospectResponse;
import com.group8.Backend.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.KeyLengthException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    private final RestClient.Builder builder;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse>authenticationRequest(@RequestBody AuthenticationRequest authenticationRequest) throws KeyLengthException {
       var result = authenticationService.authenticate(authenticationRequest);
       return ApiResponse.<AuthenticationResponse>builder()
               .code(1000)
               .result(result)
               .build();

    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse>authenticationRequest(@RequestBody IntrospectRequest request) throws JOSEException, ParseException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .code(1000)
                .result(result)
                .build();


    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse>authenticate(@RequestBody RefreshRequest request) throws JOSEException, ParseException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();


    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws JOSEException, ParseException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .code(1000)
                .build();


    }
}
