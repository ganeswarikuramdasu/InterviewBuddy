package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtTestQuestionRepository extends JpaRepository<CrtTestQuestion, Long> {
    List<CrtTestQuestion> findByTestIdOrderByDisplayOrderAsc(Long testId);
    void deleteByTestId(Long testId);
}
