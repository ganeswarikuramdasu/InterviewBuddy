package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtTestRepository extends JpaRepository<CrtTest, Long> {
    List<CrtTest> findByCategoryIdAndIsPublishedTrue(Long categoryId);
    Page<CrtTest> findByIsPublishedTrue(Pageable pageable);
}
