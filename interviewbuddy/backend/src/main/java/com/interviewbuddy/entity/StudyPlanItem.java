package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_plan_item")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 0 = Sunday ... 6 = Saturday */
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    @Column(nullable = false, length = 100)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 20)
    private StudyPlanType type;

    @Column(length = 20)
    private String time;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(nullable = false)
    @Builder.Default
    private Boolean done = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (done == null) done = false;
    }
}
