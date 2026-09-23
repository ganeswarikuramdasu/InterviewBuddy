package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CodingStatus;
import com.interviewbuddy.entity.UserProblemProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserProblemProgressRepository extends JpaRepository<UserProblemProgress, Long> {
    Optional<UserProblemProgress> findByUserIdAndProblemId(Long userId, Long problemId);
    List<UserProblemProgress> findByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, CodingStatus status);

    @Query("SELECT p.problemId FROM UserProblemProgress p WHERE p.userId = :userId AND p.status = :status")
    List<Long> findProblemIdsByUserAndStatus(@Param("userId") Long userId, @Param("status") CodingStatus status);
}
