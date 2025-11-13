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
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    private static final Logger logger = LoggerFactory.getLogger(ApplicationInitConfig.class);

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

                setFieldWithFallback(user, "accountStatus", "ACTIVE", null);

                try {
                    userRepository.save(user);
                } catch (DataIntegrityViolationException ex) {
                    // Log and continue so the application doesn't fail to start because of sample data
                    logger.warn("Skipping sample user save due to DB constraint: {}", ex.getMessage());
                }

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

    private void setFieldWithFallback(Object target, String fieldName, Object value, Object enumFallback) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            if (value == null && enumFallback == null) {
                return;
            }
            Class<?> fieldType = field.getType();
            if (fieldType.isEnum()) {
                // value may be an enum instance, or a String name
                if (value != null && fieldType.isInstance(value)) {
                    field.set(target, value);
                    return;
                }
                String name = (value != null) ? value.toString() : (enumFallback != null ? enumFallback.toString() : null);
                if (name != null) {
                    try {
                        @SuppressWarnings({ "unchecked", "rawtypes" })
                        Object enumVal = Enum.valueOf((Class<? extends Enum>) fieldType, name);
                        field.set(target, enumVal);
                        return;
                    } catch (IllegalArgumentException ex) {
                        log.warn("Invalid enum name '{}' for {}, will try fallback/default", name, fieldType.getSimpleName());
                    }
                }
                // final safety: if enum has values, pick the first as default
                Object[] constants = fieldType.getEnumConstants();
                if (constants != null && constants.length > 0) {
                    field.set(target, constants[0]);
                    return;
                }
                // leave null if nothing fits (but caller should avoid saving entity with NOT NULL columns)
            } else {
                // non-enum, set normally (convert if necessary)
                field.set(target, value != null ? value : enumFallback);
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {
            log.error("Failed to set field value via reflection", e);
        }
    }
}