package com.group8.Backend.repository;

import com.group8.Backend.entity.Actor;
import com.group8.Backend.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActorRepository extends JpaRepository<Actor,Integer> {
    
}
