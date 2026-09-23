package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "study_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyGoals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "coding_per_week")
    @Builder.Default
    private Integer codingPerWeek = 5;

    @Column(name = "interviews_per_week")
    @Builder.Default
    private Integer interviewsPerWeek = 1;

    @Column(name = "learning_per_week")
    @Builder.Default
    private Integer learningPerWeek = 2;
}
