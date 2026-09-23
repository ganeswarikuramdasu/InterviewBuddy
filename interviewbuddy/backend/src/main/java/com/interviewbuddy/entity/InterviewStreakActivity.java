package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * One calendar day on which a user completed an interview practice activity.
 *
 * The UNIQUE (user_id, activity_date) constraint guarantees a user can never
 * have more than one qualifying practice day per calendar date, so duplicate
 * or concurrent completion attempts can never inflate a streak.
 */
@Entity
@Table(name = "interview_streak_activity",
        uniqueConstraints = @UniqueConstraint(name = "uk_streak_user_date", columnNames = {"user_id", "activity_date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewStreakActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "activity_type", nullable = false, length = 20)
    @Builder.Default
    private String activityType = "INTERVIEW";

    @Column(name = "activity_reference_id")
    private Long activityReferenceId;

    @Column(name = "completed_at", updatable = false)
    private LocalDateTime completedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}