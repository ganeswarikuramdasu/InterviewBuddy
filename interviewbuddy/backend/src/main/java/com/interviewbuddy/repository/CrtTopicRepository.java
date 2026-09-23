package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CrtTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrtTopicRepository extends JpaRepository<CrtTopic, Long> {
    List<CrtTopic> findByCategoryIdOrderByDisplayOrderAsc(Long categoryId);
}
