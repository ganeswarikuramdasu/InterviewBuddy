package com.interviewbuddy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coding_problems")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CodingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 170)
    private String slug;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String description;

    @Column(name = "constraints_text", columnDefinition = "LONGTEXT")
    @Lob
    private String constraintsText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private DifficultyLevel difficulty;

    @Column(length = 60)
    private String topic;

    @Lob
    @Column(name = "starter_code", columnDefinition = "LONGTEXT")
    private String starterCode;

    @Column(name = "pattern_id")
    private Long patternId;

    @ManyToMany
    @JoinTable(
            name = "coding_sheet_problems",
            joinColumns = @JoinColumn(name = "problem_id"),
            inverseJoinColumns = @JoinColumn(name = "sheet_id")
    )
    @Builder.Default
    private List<CodingSheet> sheets = new ArrayList<>();

    @Column(name = "external_url", length = 500)
    private String externalUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform", length = 20)
    @Builder.Default
    private CodingPlatform platform = CodingPlatform.OTHER;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private Boolean isPublished = true;

    public List<Long> getSheetIds() {
        if (sheets == null) return List.of();
        return sheets.stream().map(CodingSheet::getId).toList();
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
