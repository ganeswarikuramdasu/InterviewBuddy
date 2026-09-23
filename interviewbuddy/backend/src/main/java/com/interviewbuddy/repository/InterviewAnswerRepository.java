package com.interviewbuddy.repository;

import com.interviewbuddy.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {
    List<InterviewAnswer> findBySessionIdOrderByDisplayOrderAsc(Long sessionId);
}
