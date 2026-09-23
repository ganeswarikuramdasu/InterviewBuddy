package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.CodingPatternRequest;
import com.interviewbuddy.dto.request.CodingProblemRequest;
import com.interviewbuddy.dto.request.CodingSheetRequest;
import com.interviewbuddy.dto.request.ProblemStatusUpdateRequest;
import com.interviewbuddy.dto.request.SubmissionRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CodingService {
    // Sheets & Patterns
    List<CodingSheetResponse> listSheets();
    CodingSheetResponse getSheet(Long sheetId);
    CodingSheetResponse createSheet(CodingSheetRequest request);
    CodingSheetResponse updateSheet(Long sheetId, CodingSheetRequest request);
    void deleteSheet(Long sheetId);

    List<CodingPatternResponse> listPatterns();
    CodingPatternResponse getPattern(Long patternId);
    CodingPatternResponse createPattern(CodingPatternRequest request);
    CodingPatternResponse updatePattern(Long patternId, CodingPatternRequest request);
    void deletePattern(Long patternId);

    // Problems
    Page<CodingProblemSummaryResponse> listProblems(Long currentUserId, String search, DifficultyLevel difficulty,
                                                    Long sheetId, Long patternId, Pageable pageable);
    CodingProblemDetailResponse getProblem(Long currentUserId, String slug);
    List<ProblemProgressResponse> listProgress(Long currentUserId);

    // Status tracking
    CodingProblemDetailResponse updateProblemStatus(Long userId, Long problemId, ProblemStatusUpdateRequest request);
    CodingProblemDetailResponse startProblem(Long userId, Long problemId);

    // Submission (legacy, editor removed from UI)
    SubmissionResponse submit(Long userId, Long problemId, SubmissionRequest request);
    Page<SubmissionResponse> listSubmissions(Long userId, Pageable pageable);

    // Admin problems
    CodingProblemDetailResponse createProblem(CodingProblemRequest request);
    CodingProblemDetailResponse updateProblem(Long problemId, CodingProblemRequest request);
    void deleteProblem(Long problemId);
}
