package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtTestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtTestAttemptRepository extends JpaRepository<CrtTestAttempt, Long> {
    List<CrtTestAttempt> findByUserIdOrderByStartedAtDesc(Long userId);
    List<CrtTestAttempt> findByTestId(Long testId);
}
