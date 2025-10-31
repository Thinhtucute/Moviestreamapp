package com.group8.Backend.repository;

import com.group8.Backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findById(Integer id);

    List<Role> findAllById(Iterable<Integer> ids); // Multiple roles by ID

    Optional<Role> findByRoleName(String roleName); // Custom method to find by roleName
}