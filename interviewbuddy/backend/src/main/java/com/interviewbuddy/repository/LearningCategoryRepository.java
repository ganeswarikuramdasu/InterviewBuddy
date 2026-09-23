package com.interviewbuddy.repository;

import com.interviewbuddy.entity.LearningCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningCategoryRepository extends JpaRepository<LearningCategory, Long> {
    List<LearningCategory> findAllByOrderByDisplayOrderAsc();
    List<LearningCategory> findByUserIdOrderByDisplayOrderAsc(Long userId);
}
