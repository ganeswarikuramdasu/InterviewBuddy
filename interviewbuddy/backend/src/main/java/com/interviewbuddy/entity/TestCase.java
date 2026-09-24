package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_cases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Lob
    @Column(name = "input_data", nullable = false, columnDefinition = "text")
    private String inputData;

    @Lob
    @Column(name = "expected_output", nullable = false, columnDefinition = "text")
    private String expectedOutput;

    @Column(name = "is_sample", nullable = false)
    @Builder.Default
    private Boolean isSample = false;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
