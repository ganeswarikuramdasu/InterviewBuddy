package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.*;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.*;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.DuplicateResourceException;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.CodeExecutionResult;
import com.interviewbuddy.service.CodeExecutionService;
import com.interviewbuddy.service.CodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CodingServiceImpl implements CodingService {

    private final CodingProblemRepository problemRepository;
    private final CodingExampleRepository exampleRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionRepository submissionRepository;
    private final UserSolvedProblemRepository solvedRepository;
    private final UserProblemProgressRepository progressRepository;
    private final CodingSheetRepository sheetRepository;
    private final CodingPatternRepository patternRepository;
    private final CodeExecutionService codeExecutionService;

    // ------------------------------------------------------------------
    // Sheets
    // ------------------------------------------------------------------
    @Override
    public List<CodingSheetResponse> listSheets() {
        return sheetRepository.findAllByOrderByPositionAsc().stream()
                .map(s -> toSheetResponse(s, problemRepository.countBySheetId(s.getId())))
                .toList();
    }

    @Override
    public CodingSheetResponse getSheet(Long sheetId) {
        CodingSheet sheet = sheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Sheet not found with id: " + sheetId));
        return toSheetResponse(sheet, problemRepository.countBySheetId(sheetId));
    }

    @Override
    @Transactional
    public CodingSheetResponse createSheet(CodingSheetRequest request) {
        if (sheetRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("A sheet with that name already exists");
        }
        CodingSheet sheet = CodingSheet.builder()
                .name(request.getName())
                .slug(toSlug(request.getName()))
                .description(request.getDescription())
                .position(request.getPosition() != null ? request.getPosition() : 0)
                .build();
        sheet = sheetRepository.save(sheet);
        return toSheetResponse(sheet, 0L);
    }

    @Override
    @Transactional
    public CodingSheetResponse updateSheet(Long sheetId, CodingSheetRequest request) {
        CodingSheet sheet = sheetRepository.findById(sheetId)
                .orElseThrow(() -> new ResourceNotFoundException("Sheet not found with id: " + sheetId));
        sheet.setName(request.getName());
        sheet.setSlug(toSlug(request.getName()));
        sheet.setDescription(request.getDescription());
        if (request.getPosition() != null) sheet.setPosition(request.getPosition());
        sheet = sheetRepository.save(sheet);
        return toSheetResponse(sheet, problemRepository.countBySheetId(sheetId));
    }

    @Override
    @Transactional
    public void deleteSheet(Long sheetId) {
        if (!sheetRepository.existsById(sheetId)) {
            throw new ResourceNotFoundException("Sheet not found with id: " + sheetId);
        }
        // Detach problems from the sheet before deleting
        List<CodingProblem> problems = problemRepository.findAll().stream()
                .filter(p -> p.getSheets() != null
                        && p.getSheets().stream().anyMatch(s -> sheetId.equals(s.getId())))
                .toList();
        for (CodingProblem p : problems) {
            p.getSheets().removeIf(s -> sheetId.equals(s.getId()));
            problemRepository.save(p);
        }
        sheetRepository.deleteById(sheetId);
    }

    private CodingSheetResponse toSheetResponse(CodingSheet s, long count) {
        return CodingSheetResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .slug(s.getSlug())
                .description(s.getDescription())
                .position(s.getPosition())
                .problemCount(count)
                .build();
    }

    // ------------------------------------------------------------------
    // Patterns
    // ------------------------------------------------------------------
    @Override
    public List<CodingPatternResponse> listPatterns() {
        Map<Long, Long> counts = problemRepository.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsPublished()) && p.getPatternId() != null)
                .collect(Collectors.groupingBy(CodingProblem::getPatternId, Collectors.counting()));
        return patternRepository.findAllByOrderByPositionAsc().stream()
                .map(p -> toPatternResponse(p, counts.getOrDefault(p.getId(), 0L)))
                .toList();
    }

    @Override
    public CodingPatternResponse getPattern(Long patternId) {
        CodingPattern pattern = patternRepository.findById(patternId)
                .orElseThrow(() -> new ResourceNotFoundException("Pattern not found with id: " + patternId));
        return toPatternResponse(pattern, problemRepository.countByPatternId(patternId));
    }

    @Override
    @Transactional
    public CodingPatternResponse createPattern(CodingPatternRequest request) {
        if (patternRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("A pattern with that name already exists");
        }
        CodingPattern pattern = CodingPattern.builder()
                .name(request.getName())
                .slug(toSlug(request.getName()))
                .description(request.getDescription())
                .position(request.getPosition() != null ? request.getPosition() : 0)
                .build();
        pattern = patternRepository.save(pattern);
        return toPatternResponse(pattern, 0L);
    }

    @Override
    @Transactional
    public CodingPatternResponse updatePattern(Long patternId, CodingPatternRequest request) {
        CodingPattern pattern = patternRepository.findById(patternId)
                .orElseThrow(() -> new ResourceNotFoundException("Pattern not found with id: " + patternId));
        pattern.setName(request.getName());
        pattern.setSlug(toSlug(request.getName()));
        pattern.setDescription(request.getDescription());
        if (request.getPosition() != null) pattern.setPosition(request.getPosition());
        pattern = patternRepository.save(pattern);
        return toPatternResponse(pattern, problemRepository.countByPatternId(patternId));
    }

    @Override
    @Transactional
    public void deletePattern(Long patternId) {
        if (!patternRepository.existsById(patternId)) {
            throw new ResourceNotFoundException("Pattern not found with id: " + patternId);
        }
        List<CodingProblem> problems = problemRepository.findAll().stream()
                .filter(p -> patternId.equals(p.getPatternId()))
                .toList();
        for (CodingProblem p : problems) {
            p.setPatternId(null);
            problemRepository.save(p);
        }
        patternRepository.deleteById(patternId);
    }

    private CodingPatternResponse toPatternResponse(CodingPattern p, long count) {
        return CodingPatternResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .slug(p.getSlug())
                .description(p.getDescription())
                .position(p.getPosition())
                .problemCount(count)
                .build();
    }

    // ------------------------------------------------------------------
    // Problems
    // ------------------------------------------------------------------
    @Override
    public Page<CodingProblemSummaryResponse> listProblems(Long currentUserId, String search, DifficultyLevel difficulty,
                                                           Long sheetId, Long patternId, Pageable pageable) {
        Map<Long, CodingStatus> statusMap = statusMapFor(currentUserId);
        Map<Long, CodingPattern> patterns = patternMap();

        return problemRepository.search(nullIfBlank(search), difficulty, sheetId, patternId, pageable)
                .map(p -> CodingProblemSummaryResponse.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .slug(p.getSlug())
                        .difficulty(p.getDifficulty().name())
                        .topic(p.getTopic())
                        .platform(p.getPlatform() != null ? p.getPlatform().name() : "OTHER")
                        .externalUrl(p.getExternalUrl())
                        .patternName(p.getPatternId() != null && patterns.containsKey(p.getPatternId())
                                ? patterns.get(p.getPatternId()).getName() : null)
                        .sheetName(sheetNames(p))
                        .sheetIds(p.getSheetIds())
                        .status(statusMap.getOrDefault(p.getId(), CodingStatus.NOT_STARTED).name())
                        .build());
    }

    @Override
    public CodingProblemDetailResponse getProblem(Long currentUserId, String slug) {
        CodingProblem problem = problemRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: " + slug));

        List<CodingProblemDetailResponse.ExampleDto> examples = exampleRepository
                .findByProblemIdOrderByDisplayOrderAsc(problem.getId())
                .stream()
                .map(e -> CodingProblemDetailResponse.ExampleDto.builder()
                        .inputText(e.getInputText())
                        .outputText(e.getOutputText())
                        .explanation(e.getExplanation())
                        .build())
                .toList();

        List<Long> sheetIds = problem.getSheetIds();
        String sheetName = sheetIds.isEmpty() ? null
                : problem.getSheets().stream()
                        .map(CodingSheet::getName)
                        .sorted()
                        .collect(Collectors.joining(", "));
        String patternName = problem.getPatternId() != null
                ? patternRepository.findById(problem.getPatternId()).map(CodingPattern::getName).orElse(null)
                : null;
        CodingStatus status = currentUserId != null
                ? progressRepository.findByUserIdAndProblemId(currentUserId, problem.getId())
                        .map(UserProblemProgress::getStatus).orElse(CodingStatus.NOT_STARTED)
                : CodingStatus.NOT_STARTED;

        return CodingProblemDetailResponse.builder()
                .id(problem.getId())
                .title(problem.getTitle())
                .slug(problem.getSlug())
                .description(problem.getDescription())
                .constraintsText(problem.getConstraintsText())
                .difficulty(problem.getDifficulty().name())
                .topic(problem.getTopic())
                .platform(problem.getPlatform() != null ? problem.getPlatform().name() : "OTHER")
                .externalUrl(problem.getExternalUrl())
                .sheetId(sheetIds.isEmpty() ? null : sheetIds.get(0))
                .sheetName(sheetName)
                .sheetIds(sheetIds)
                .patternId(problem.getPatternId())
                .patternName(patternName)
                .status(status.name())
                .examples(examples)
                .build();
    }

    @Override
    public List<ProblemProgressResponse> listProgress(Long currentUserId) {
        if (currentUserId == null) return List.of();
        Map<Long, CodingPattern> patterns = patternMap();
        return progressRepository.findByUserId(currentUserId).stream()
                .map(pr -> {
                    CodingProblem p = problemRepository.findById(pr.getProblemId()).orElse(null);
                    if (p == null) return null;
                    return ProblemProgressResponse.builder()
                            .problemId(p.getId())
                            .problemTitle(p.getTitle())
                            .problemSlug(p.getSlug())
                            .difficulty(p.getDifficulty().name())
                            .platform(p.getPlatform() != null ? p.getPlatform().name() : "OTHER")
                            .patternName(p.getPatternId() != null && patterns.containsKey(p.getPatternId())
                                    ? patterns.get(p.getPatternId()).getName() : null)
                            .status(pr.getStatus().name())
                            .updatedAt(pr.getUpdatedAt() != null ? pr.getUpdatedAt().toString() : null)
                            .build();
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @Override
    @Transactional
    public CodingProblemDetailResponse updateProblemStatus(Long userId, Long problemId, ProblemStatusUpdateRequest request) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        CodingStatus status = request.getStatus();
        if (status == null) {
            throw new BadRequestException("Status is required");
        }
        UserProblemProgress progress = progressRepository.findByUserIdAndProblemId(userId, problemId)
                .orElseGet(() -> UserProblemProgress.builder()
                        .userId(userId)
                        .problemId(problemId)
                        .status(CodingStatus.NOT_STARTED)
                        .build());
        progress.setStatus(status);
        progressRepository.save(progress);
        return getProblem(userId, problem.getSlug());
    }

    @Override
    @Transactional
    public CodingProblemDetailResponse startProblem(Long userId, Long problemId) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        UserProblemProgress progress = progressRepository.findByUserIdAndProblemId(userId, problemId)
                .orElseGet(() -> UserProblemProgress.builder()
                        .userId(userId)
                        .problemId(problemId)
                        .status(CodingStatus.NOT_STARTED)
                        .build());
        // Auto-mark as in progress when the user opens it, but never downgrade a solved problem.
        if (progress.getStatus() != CodingStatus.SOLVED) {
            progress.setStatus(CodingStatus.IN_PROGRESS);
            progressRepository.save(progress);
        }
        return getProblem(userId, problem.getSlug());
    }

    // ------------------------------------------------------------------
    // Legacy submission (editor removed from UI)
    // ------------------------------------------------------------------
    @Override
    @Transactional
    public SubmissionResponse submit(Long userId, Long problemId, SubmissionRequest request) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));

        List<TestCase> testCases = testCaseRepository.findByProblemIdOrderByDisplayOrderAsc(problemId);
        if (testCases.isEmpty()) {
            throw new BadRequestException("This problem has no test cases configured yet");
        }

        CodeExecutionResult result = codeExecutionService.run(request.getLanguage(), request.getSourceCode(), testCases);

        Submission submission = Submission.builder()
                .userId(userId)
                .problemId(problemId)
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .status(result.getStatus())
                .passedTestCases(result.getPassedTestCases())
                .totalTestCases(result.getTotalTestCases())
                .executionTimeMs(result.getExecutionTimeMs())
                .memoryKb(result.getMemoryKb())
                .stdoutSnippet(result.getStdoutSnippet())
                .build();
        final Submission savedSubmission = submissionRepository.save(submission);

        if (result.getStatus() == SubmissionStatus.ACCEPTED) {
            solvedRepository.findByUserIdAndProblemId(userId, problemId).ifPresentOrElse(
                    existing -> {
                        existing.setBestSubmissionId(savedSubmission.getId());
                        solvedRepository.save(existing);
                    },
                    () -> solvedRepository.save(UserSolvedProblem.builder()
                            .userId(userId)
                            .problemId(problemId)
                            .bestSubmissionId(savedSubmission.getId())
                            .build())
            );
        }

        return toSubmissionResponse(savedSubmission, problem.getTitle());
    }

    @Override
    public Page<SubmissionResponse> listSubmissions(Long userId, Pageable pageable) {
        return submissionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(s -> {
                    String title = problemRepository.findById(s.getProblemId()).map(CodingProblem::getTitle).orElse("Unknown");
                    return toSubmissionResponse(s, title);
                });
    }

    // ------------------------------------------------------------------
    // Admin problems
    // ------------------------------------------------------------------
    @Override
    @Transactional
    public CodingProblemDetailResponse createProblem(CodingProblemRequest request) {
        String slug = toSlug(request.getTitle());
        if (problemRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("A problem with a similar title already exists (slug: " + slug + ")");
        }
        List<Long> sheetIds = resolveSheetIds(request);
        validatePattern(request);

        CodingProblem problem = CodingProblem.builder()
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .constraintsText(request.getConstraintsText())
                .difficulty(request.getDifficulty())
                .topic(request.getTopic())
                .starterCode(request.getStarterCode())
                .sheets(sheetIds.isEmpty() ? List.of() : sheetRepository.findAllById(sheetIds))
                .patternId(request.getPatternId())
                .externalUrl(request.getExternalUrl())
                .platform(request.getPlatform() != null ? request.getPlatform() : CodingPlatform.OTHER)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .build();
        problem = problemRepository.save(problem);

        saveExamplesAndTestCases(problem.getId(), request);
        return getProblem(null, problem.getSlug());
    }

    @Override
    @Transactional
    public CodingProblemDetailResponse updateProblem(Long problemId, CodingProblemRequest request) {
        CodingProblem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        List<Long> sheetIds = resolveSheetIds(request);
        validatePattern(request);

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setConstraintsText(request.getConstraintsText());
        problem.setDifficulty(request.getDifficulty());
        problem.setTopic(request.getTopic());
        problem.setStarterCode(request.getStarterCode());
        problem.setSheets(sheetIds.isEmpty() ? List.of() : new java.util.ArrayList<>(sheetRepository.findAllById(sheetIds)));
        problem.setPatternId(request.getPatternId());
        problem.setExternalUrl(request.getExternalUrl());
        problem.setPlatform(request.getPlatform() != null ? request.getPlatform() : CodingPlatform.OTHER);
        if (request.getIsPublished() != null) problem.setIsPublished(request.getIsPublished());
        problemRepository.save(problem);

        exampleRepository.findByProblemIdOrderByDisplayOrderAsc(problemId).forEach(exampleRepository::delete);
        testCaseRepository.findByProblemIdOrderByDisplayOrderAsc(problemId).forEach(testCaseRepository::delete);
        saveExamplesAndTestCases(problemId, request);

        return getProblem(null, problem.getSlug());
    }

    @Override
    @Transactional
    public void deleteProblem(Long problemId) {
        if (!problemRepository.existsById(problemId)) {
            throw new ResourceNotFoundException("Problem not found with id: " + problemId);
        }
        problemRepository.deleteById(problemId);
    }

    private List<Long> resolveSheetIds(CodingProblemRequest request) {
        List<Long> ids = new java.util.ArrayList<>();
        if (request.getSheetIds() != null && !request.getSheetIds().isEmpty()) {
            ids.addAll(request.getSheetIds());
        } else if (request.getSheetId() != null) {
            ids.add(request.getSheetId());
        }
        List<Long> distinct = ids.stream().distinct().toList();
        for (Long id : distinct) {
            if (!sheetRepository.existsById(id)) {
                throw new BadRequestException("Sheet not found with id: " + id);
            }
        }
        return distinct;
    }

    private void validatePattern(CodingProblemRequest request) {
        if (request.getPatternId() != null && !patternRepository.existsById(request.getPatternId())) {
            throw new BadRequestException("Pattern not found with id: " + request.getPatternId());
        }
    }

    private void saveExamplesAndTestCases(Long problemId, CodingProblemRequest request) {
        if (request.getExamples() != null) {
            int order = 1;
            for (CodingProblemRequest.ExampleInput ex : request.getExamples()) {
                exampleRepository.save(CodingExample.builder()
                        .problemId(problemId)
                        .inputText(ex.getInputText())
                        .outputText(ex.getOutputText())
                        .explanation(ex.getExplanation())
                        .displayOrder(order++)
                        .build());
            }
        }
        if (request.getTestCases() != null) {
            int order = 1;
            for (CodingProblemRequest.TestCaseInput tc : request.getTestCases()) {
                testCaseRepository.save(TestCase.builder()
                        .problemId(problemId)
                        .inputData(tc.getInputData())
                        .expectedOutput(tc.getExpectedOutput())
                        .isSample(tc.getIsSample() != null ? tc.getIsSample() : false)
                        .displayOrder(order++)
                        .build());
            }
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------
    private Map<Long, CodingStatus> statusMapFor(Long userId) {
        if (userId == null) return Map.of();
        return progressRepository.findByUserId(userId).stream()
                .collect(Collectors.toMap(UserProblemProgress::getProblemId, UserProblemProgress::getStatus));
    }

    private Map<Long, CodingPattern> patternMap() {
        return patternRepository.findAll().stream()
                .collect(Collectors.toMap(CodingPattern::getId, Function.identity()));
    }

    private String sheetNames(CodingProblem p) {
        if (p.getSheets() == null || p.getSheets().isEmpty()) return null;
        return p.getSheets().stream()
                .map(CodingSheet::getName)
                .sorted()
                .collect(Collectors.joining(", "));
    }

    private SubmissionResponse toSubmissionResponse(Submission s, String title) {
        return SubmissionResponse.builder()
                .id(s.getId())
                .problemId(s.getProblemId())
                .problemTitle(title)
                .language(s.getLanguage())
                .status(s.getStatus().name())
                .passedTestCases(s.getPassedTestCases())
                .totalTestCases(s.getTotalTestCases())
                .executionTimeMs(s.getExecutionTimeMs())
                .stdoutSnippet(s.getStdoutSnippet())
                .createdAt(s.getCreatedAt())
                .build();
    }

    private String toSlug(String title) {
        String base = title.toLowerCase().trim().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-");
        if (base.isBlank()) base = "item";
        return base;
    }

    private String nullIfBlank(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
