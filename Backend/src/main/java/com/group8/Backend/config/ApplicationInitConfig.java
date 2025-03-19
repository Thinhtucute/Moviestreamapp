package com.group8.Backend.config;

import com.group8.Backend.entity.User;
import com.group8.Backend.enums.Role;
import com.group8.Backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor  // Tự động inject dependencies
@Slf4j  // Inject Logger
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    final PasswordEncoder passwordEncoder;
    final UserRepository userRepository; // Thêm final để được inject

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Set<String> roles = new HashSet<>();
                roles.add(Role.ADMIN.name());

                User user = User.builder()
                        .email("admin@admin.com")
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("admin1234")) // Đảm bảo đúng tên field
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Admin has been created with default password: admin1234, please change it!");
            }
        };
    }
}
