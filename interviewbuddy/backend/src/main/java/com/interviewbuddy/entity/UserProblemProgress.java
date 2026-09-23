package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_problem_progress",
        uniqueConstraints = @UniqueConstraint(name = "uq_progress_user_problem", columnNames = {"user_id", "problem_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProblemProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CodingStatus status = CodingStatus.NOT_STARTED;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        updatedAt = LocalDateTime.now();
        if (status == CodingStatus.SOLVED && solvedAt == null) solvedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == CodingStatus.SOLVED && solvedAt == null) solvedAt = LocalDateTime.now();
        if (status != CodingStatus.SOLVED) solvedAt = null;
    }
}
