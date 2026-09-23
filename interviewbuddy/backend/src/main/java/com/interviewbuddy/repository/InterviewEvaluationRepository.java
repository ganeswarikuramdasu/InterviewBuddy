package com.interviewbuddy.repository;

import com.interviewbuddy.entity.InterviewEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InterviewEvaluationRepository extends JpaRepository<InterviewEvaluation, Long> {
    Optional<InterviewEvaluation> findByAnswerId(Long answerId);
}
