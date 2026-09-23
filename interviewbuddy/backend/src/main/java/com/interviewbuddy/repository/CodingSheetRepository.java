package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CodingSheet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CodingSheetRepository extends JpaRepository<CodingSheet, Long> {
    Optional<CodingSheet> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByNameIgnoreCase(String name);
    List<CodingSheet> findAllByOrderByPositionAsc();
}
