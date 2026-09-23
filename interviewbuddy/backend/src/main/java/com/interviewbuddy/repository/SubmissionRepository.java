package com.interviewbuddy.repository;

import com.interviewbuddy.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    Page<Submission> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Submission> findByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, com.interviewbuddy.entity.SubmissionStatus status);
}
