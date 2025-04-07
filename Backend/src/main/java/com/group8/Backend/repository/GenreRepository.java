package com.group8.Backend.repository;

import com.group8.Backend.entity.Genre;
import com.group8.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre,Integer> {

}
