package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crt_test_attempts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CrtTestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_id", nullable = false)
    private Long testId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Builder.Default
    private Integer score = 0;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_count")
    @Builder.Default
    private Integer correctCount = 0;

    @Column(name = "incorrect_count")
    @Builder.Default
    private Integer incorrectCount = 0;

    @Column(name = "unanswered_count")
    @Builder.Default
    private Integer unansweredCount = 0;

    @Column(name = "time_taken_seconds")
    private Integer timeTakenSeconds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @PrePersist
    protected void onCreate() { startedAt = LocalDateTime.now(); }
}
