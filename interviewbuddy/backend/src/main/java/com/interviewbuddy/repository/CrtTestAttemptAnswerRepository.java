package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtTestAttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtTestAttemptAnswerRepository extends JpaRepository<CrtTestAttemptAnswer, Long> {
    List<CrtTestAttemptAnswer> findByAttemptId(Long attemptId);
}
