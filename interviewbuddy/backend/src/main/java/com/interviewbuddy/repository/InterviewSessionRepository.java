package com.interviewbuddy.repository;

import com.interviewbuddy.entity.InterviewSession;
import com.interviewbuddy.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);
    List<InterviewSession> findByStatus(SessionStatus status);
    long countByUserId(Long userId);
}
