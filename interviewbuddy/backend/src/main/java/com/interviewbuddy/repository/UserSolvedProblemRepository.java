package com.interviewbuddy.repository;

import com.interviewbuddy.entity.UserSolvedProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserSolvedProblemRepository extends JpaRepository<UserSolvedProblem, Long> {
    List<UserSolvedProblem> findByUserId(Long userId);
    Optional<UserSolvedProblem> findByUserIdAndProblemId(Long userId, Long problemId);
    boolean existsByUserIdAndProblemId(Long userId, Long problemId);
    long countByUserId(Long userId);
}
