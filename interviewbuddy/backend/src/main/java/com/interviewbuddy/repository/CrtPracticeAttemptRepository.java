package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtPracticeAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CrtPracticeAttemptRepository extends JpaRepository<CrtPracticeAttempt, Long> {
    List<CrtPracticeAttempt> findByUserId(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndIsCorrectTrue(Long userId);

    @Query("SELECT COUNT(a) FROM CrtPracticeAttempt a WHERE a.userId = :userId AND a.questionId IN " +
           "(SELECT q.id FROM CrtQuestion q WHERE q.categoryId = :categoryId)")
    long countByUserIdAndCategoryId(@Param("userId") Long userId, @Param("categoryId") Long categoryId);
}
