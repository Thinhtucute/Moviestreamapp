package com.group8.Backend.repository;

import com.group8.Backend.entity.Actor;
import com.group8.Backend.entity.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director,Integer> {
	Optional<Director> findFirstByDirectorNameIgnoreCase(String directorName);
}
