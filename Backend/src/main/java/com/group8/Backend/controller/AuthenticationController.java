package com.group8.Backend.controller;

import com.group8.Backend.dto.request.ApiResponse;
import com.group8.Backend.dto.request.AuthenticationRequest;
import com.group8.Backend.dto.response.AuthenticationResponse;
import com.group8.Backend.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    private final RestClient.Builder builder;

    @PostMapping("/log-in")
    ApiResponse<AuthenticationResponse>authenticationRequest(@RequestBody AuthenticationRequest authenticationRequest){
       boolean result = authenticationService.authenticate(authenticationRequest);
       return ApiResponse.<AuthenticationResponse>builder()
               .code(1000)
               .result(AuthenticationResponse.builder()
                       .authenticated(result)
                       .build())
               .build();


    }
}
