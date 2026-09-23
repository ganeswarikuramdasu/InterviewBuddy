package com.interviewbuddy.repository;

import com.interviewbuddy.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByProblemIdOrderByDisplayOrderAsc(Long problemId);
    List<TestCase> findByProblemIdAndIsSampleTrue(Long problemId);
}
