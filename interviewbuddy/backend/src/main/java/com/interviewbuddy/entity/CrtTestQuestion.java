package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "crt_test_questions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CrtTestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "test_id", nullable = false)
    private Long testId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
