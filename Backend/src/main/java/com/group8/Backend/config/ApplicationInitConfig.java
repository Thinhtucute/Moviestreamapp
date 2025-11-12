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

import java.lang.reflect.Field;
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
            createRolesIfNotExist();

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

                // Try to set AccountStatus via reflection so compile won't fail if enum package/name differs.
                try {
                    Class<?> enumClass;
                    try {
                        enumClass = Class.forName("com.group8.Backend.enums.AccountStatus");
                    } catch (ClassNotFoundException ex) {
                        enumClass = Class.forName("com.group8.backend.enums.AccountStatus");
                    }

                    @SuppressWarnings({"unchecked", "rawtypes"})
                    Enum<?> active = Enum.valueOf((Class<Enum>) enumClass, "ACTIVE");

                    try {
                        // try setter first
                        user.getClass().getMethod("setAccountStatus", enumClass).invoke(user, active);
                    } catch (NoSuchMethodException nsme) {
                        // fallback: set field directly
                        Field f = user.getClass().getDeclaredField("accountStatus");
                        f.setAccessible(true);
                        f.set(user, active);
                    }
                } catch (ClassNotFoundException cnfe) {
                    log.warn("AccountStatus enum not found in expected packages; attempting String fallback");
                    try {
                        Field f = user.getClass().getDeclaredField("accountStatus");
                        f.setAccessible(true);
                        f.set(user, "ACTIVE");
                    } catch (Exception ex) {
                        log.error("Failed to set accountStatus fallback, user creation may fail with NOT NULL constraint", ex);
                    }
                } catch (Exception e) {
                    log.error("Failed to set AccountStatus via reflection", e);
                }

                userRepository.save(user);
                log.warn("Admin has been created with default password: admin1234, please change it!");
            }
        };
    }

    private void createRolesIfNotExist() {
        if (roleRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .roleName("ROLE_ADMIN")
                    .description("Administrator role with full access")
                    .build();
            roleRepository.save(adminRole);
            log.info("ROLE_ADMIN created");
        }

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