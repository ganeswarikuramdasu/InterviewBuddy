package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coding_examples")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CodingExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_id", nullable = false)
    private Long problemId;

    @Lob
    @Column(name = "input_text", nullable = false, columnDefinition = "text")
    private String inputText;

    @Lob
    @Column(name = "output_text", nullable = false, columnDefinition = "text")
    private String outputText;

    @Lob
    @Column(columnDefinition = "text")
    private String explanation;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
