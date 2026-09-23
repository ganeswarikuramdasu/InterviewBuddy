package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CrtCategoryRepository extends JpaRepository<CrtCategory, Long> {
    Optional<CrtCategory> findByName(String name);
}
