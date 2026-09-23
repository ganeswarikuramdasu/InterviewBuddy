package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CodingPattern;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CodingPatternRepository extends JpaRepository<CodingPattern, Long> {
    Optional<CodingPattern> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
    List<CodingPattern> findAllByOrderByPositionAsc();
}
