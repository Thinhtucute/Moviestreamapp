package com.group8.Backend.config;

import com.group8.Backend.entity.Role;
import com.group8.Backend.entity.User;
import com.group8.Backend.repository.RoleRepository;
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
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    RoleRepository roleRepository; // Thêm RoleRepository để lấy Role entity

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                // Tìm Role ADMIN từ cơ sở dữ liệu
                Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found in database"));

                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);

                User user = User.builder()
                        .email("admin@admin.com")
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("admin1234"))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Admin has been created with default password: admin1234, please change it!");
            }
        };
    }
}