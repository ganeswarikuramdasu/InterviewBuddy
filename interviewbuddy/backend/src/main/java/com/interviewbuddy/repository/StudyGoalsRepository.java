package com.interviewbuddy.repository;

import com.interviewbuddy.entity.StudyGoals;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyGoalsRepository extends JpaRepository<StudyGoals, Long> {
    Optional<StudyGoals> findByUserId(Long userId);
}
