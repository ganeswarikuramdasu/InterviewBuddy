package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_evaluations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer_id", nullable = false, unique = true)
    private Long answerId;

    @Column(name = "relevance_score")
    private BigDecimal relevanceScore;
    @Column(name = "technical_score")
    private BigDecimal technicalScore;
    @Column(name = "communication_score")
    private BigDecimal communicationScore;
    @Column(name = "clarity_score")
    private BigDecimal clarityScore;

    @Lob
    @Column(name = "feedback", columnDefinition = "LONGTEXT")
    private String feedback;

    @Lob
    @Column(name = "improvement_suggestions", columnDefinition = "LONGTEXT")
    private String improvementSuggestions;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
