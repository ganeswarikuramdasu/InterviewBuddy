package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_solved_problems")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSolvedProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Column(name = "first_solved_at")
    private LocalDateTime firstSolvedAt;

    @Column(name = "best_submission_id")
    private Long bestSubmissionId;

    @PrePersist
    protected void onCreate() { firstSolvedAt = LocalDateTime.now(); }
}
