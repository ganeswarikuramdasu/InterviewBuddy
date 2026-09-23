package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.ProblemStatusUpdateRequest;
import com.interviewbuddy.dto.request.SubmissionRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.CodingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
public class CodingController {

    private final CodingService codingService;

    @GetMapping("/sheets")
    public List<CodingSheetResponse> listSheets() {
        return codingService.listSheets();
    }

    @GetMapping("/patterns")
    public List<CodingPatternResponse> listPatterns() {
        return codingService.listPatterns();
    }

    @GetMapping("/my-progress")
    public List<ProblemProgressResponse> listProgress(@AuthenticationPrincipal UserPrincipal principal) {
        return codingService.listProgress(principal != null ? principal.getId() : null);
    }

    @GetMapping("/problems")
    public Page<CodingProblemSummaryResponse> listProblems(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DifficultyLevel difficulty,
            @RequestParam(required = false) Long sheetId,
            @RequestParam(required = false) Long patternId,
            @PageableDefault(size = 50) Pageable pageable) {
        Long userId = principal != null ? principal.getId() : null;
        return codingService.listProblems(userId, search, difficulty, sheetId, patternId, pageable);
    }

    @GetMapping("/problems/{slug}")
    public CodingProblemDetailResponse getProblem(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String slug) {
        Long userId = principal != null ? principal.getId() : null;
        return codingService.getProblem(userId, slug);
    }

    @PutMapping("/problems/{problemId}/status")
    public CodingProblemDetailResponse updateProblemStatus(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long problemId,
                                                           @Valid @RequestBody ProblemStatusUpdateRequest request) {
        return codingService.updateProblemStatus(principal.getId(), problemId, request);
    }

    @PostMapping("/problems/{problemId}/start")
    public CodingProblemDetailResponse startProblem(@AuthenticationPrincipal UserPrincipal principal,
                                                    @PathVariable Long problemId) {
        return codingService.startProblem(principal.getId(), problemId);
    }

    @PostMapping("/problems/{problemId}/submit")
    public SubmissionResponse submit(@AuthenticationPrincipal UserPrincipal principal,
                                      @PathVariable Long problemId,
                                      @Valid @RequestBody SubmissionRequest request) {
        return codingService.submit(principal.getId(), problemId, request);
    }

    @GetMapping("/submissions")
    public Page<SubmissionResponse> listSubmissions(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PageableDefault(size = 20) Pageable pageable) {
        return codingService.listSubmissions(principal.getId(), pageable);
    }
}
