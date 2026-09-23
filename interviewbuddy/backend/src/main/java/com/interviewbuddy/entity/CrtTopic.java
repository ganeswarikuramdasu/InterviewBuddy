package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crt_topics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CrtTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String explanation;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String concepts;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String formulas;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String examples;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String tips;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
