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
    RoleRepository roleRepository;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            // First create roles if they don't exist
            createRolesIfNotExist();

            // Then create admin user if it doesn't exist
            if (userRepository.findByUsername("admin").isEmpty()) {
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

    private void createRolesIfNotExist() {
        // Create ROLE_ADMIN if it doesn't exist
        if (roleRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .roleName("ROLE_ADMIN")
                    .description("Administrator role with full access")
                    .build();
            roleRepository.save(adminRole);
            log.info("ROLE_ADMIN created");
        }

        // Create ROLE_USER if it doesn't exist
        if (roleRepository.findByRoleName("ROLE_USER").isEmpty()) {
            Role userRole = Role.builder()
                    .roleName("ROLE_USER")
                    .description("Standard user role")
                    .build();
            roleRepository.save(userRole);
            log.info("ROLE_USER created");
        }
    }
}