package com.interviewbuddy.repository;

import com.interviewbuddy.entity.CodingProblem;
import com.interviewbuddy.entity.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CodingProblemRepository extends JpaRepository<CodingProblem, Long> {
    @EntityGraph(attributePaths = "sheets")
    Optional<CodingProblem> findBySlug(String slug);

    @EntityGraph(attributePaths = "sheets")
    Optional<CodingProblem> findById(Long id);

    boolean existsBySlug(String slug);

    @Query("SELECT COUNT(DISTINCT p) FROM CodingProblem p JOIN p.sheets s WHERE s.id = :sheetId AND p.isPublished = true")
    long countBySheetId(@Param("sheetId") Long sheetId);

    long countByPatternId(Long patternId);

    @EntityGraph(attributePaths = "sheets")
    @Query("SELECT DISTINCT p FROM CodingProblem p LEFT JOIN p.sheets ps WHERE p.isPublished = true " +
           "AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:difficulty IS NULL OR p.difficulty = :difficulty) " +
           "AND (:sheetId IS NULL OR ps.id = :sheetId) " +
           "AND (:patternId IS NULL OR p.patternId = :patternId) " +
           "ORDER BY p.difficulty, p.title")
    Page<CodingProblem> search(@Param("search") String search,
                                @Param("difficulty") DifficultyLevel difficulty,
                                @Param("sheetId") Long sheetId,
                                @Param("patternId") Long patternId,
                                Pageable pageable);

    @EntityGraph(attributePaths = "sheets")
    @Query("SELECT DISTINCT p FROM CodingProblem p LEFT JOIN p.sheets ps WHERE p.isPublished = true " +
           "AND (:sheetId IS NULL OR ps.id = :sheetId) " +
           "AND (:patternId IS NULL OR p.patternId = :patternId) " +
           "ORDER BY p.difficulty, p.title")
    java.util.List<CodingProblem> findAllPublishedForSheetPattern(@Param("sheetId") Long sheetId,
                                                                  @Param("patternId") Long patternId);
}
