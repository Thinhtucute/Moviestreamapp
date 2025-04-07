package com.group8.Backend.repository;

import com.group8.Backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findById(Integer id); // Đúng cách: nhận Integer

    List<Role> findAllById(Iterable<Integer> ids); // Để tìm nhiều Role theo danh sách ID

    Optional<Role> findByRoleName(String roleName); // Phương thức tùy chỉnh để tìm theo roleName
}