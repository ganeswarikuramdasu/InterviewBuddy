package com.interviewbuddy.repository;

import com.interviewbuddy.entity.LearningResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findByCategoryIdAndIsPublishedTrue(Long categoryId);
    List<LearningResource> findByUserIdAndCategoryId(Long userId, Long categoryId);
    long countByUserIdAndCategoryId(Long userId, Long categoryId);
    void deleteByCategoryId(Long categoryId);
    Page<LearningResource> findByIsPublishedTrue(Pageable pageable);
    long countByIsPublishedTrue();
}
