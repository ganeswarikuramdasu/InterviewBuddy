package com.interviewbuddy.repository;

import com.interviewbuddy.entity.StudyPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyPlanItemRepository extends JpaRepository<StudyPlanItem, Long> {
    List<StudyPlanItem> findByUserIdOrderByDayOfWeekAscCreatedAtAsc(Long userId);
    void deleteByUserId(Long userId);
}
