package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CodingExample;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingExampleRepository extends JpaRepository<CodingExample, Long> {
    List<CodingExample> findByProblemIdOrderByDisplayOrderAsc(Long problemId);
}
