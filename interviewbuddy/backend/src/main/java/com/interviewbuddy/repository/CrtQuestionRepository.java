package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtQuestionRepository extends JpaRepository<CrtQuestion, Long> {
    List<CrtQuestion> findByTopicId(Long topicId);
    Page<CrtQuestion> findByCategoryId(Long categoryId, Pageable pageable);
    Page<CrtQuestion> findByTopicId(Long topicId, Pageable pageable);
    long countByTopicId(Long topicId);
}
