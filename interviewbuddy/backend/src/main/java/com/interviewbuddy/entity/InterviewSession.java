package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 80)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false, length = 15)
    private InterviewType interviewType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DifficultyLevel difficulty;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(length = 500)
    private String topics;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private SessionStatus status = SessionStatus.IN_PROGRESS;

    @Column(name = "overall_score")
    private BigDecimal overallScore;
    @Column(name = "relevance_score")
    private BigDecimal relevanceScore;
    @Column(name = "technical_score")
    private BigDecimal technicalScore;
    @Column(name = "communication_score")
    private BigDecimal communicationScore;
    @Column(name = "clarity_score")
    private BigDecimal clarityScore;

    @Lob
    @Column(name = "summary_feedback", columnDefinition = "text")
    private String summaryFeedback;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() { startedAt = LocalDateTime.now(); }
}
