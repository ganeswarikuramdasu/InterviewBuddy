package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "crt_test_attempt_answers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CrtTestAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "attempt_id", nullable = false)
    private Long attemptId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "selected_option", length = 1)
    private String selectedOption;

    @Column(name = "is_correct")
    private Boolean isCorrect;
}
