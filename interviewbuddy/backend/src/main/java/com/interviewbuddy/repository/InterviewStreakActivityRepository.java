package com.interviewbuddy.repository;

import com.interviewbuddy.entity.InterviewStreakActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface InterviewStreakActivityRepository extends JpaRepository<InterviewStreakActivity, Long> {

    Optional<InterviewStreakActivity> findByUserIdAndActivityDate(Long userId, LocalDate activityDate);

    boolean existsByUserIdAndActivityDate(Long userId, LocalDate activityDate);

    List<InterviewStreakActivity> findByUserIdOrderByActivityDateAsc(Long userId);

    List<InterviewStreakActivity> findByUserIdAndActivityDateGreaterThanEqual(Long userId, LocalDate fromDate);

    long countByUserId(Long userId);
}