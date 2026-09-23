package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.request.CodingPatternRequest;
import com.interviewbuddy.dto.request.CodingProblemRequest;
import com.interviewbuddy.dto.request.CodingSheetRequest;
import com.interviewbuddy.dto.response.*;
import com.interviewbuddy.service.CodingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coding")
@RequiredArgsConstructor
public class AdminCodingController {

    private final CodingService codingService;

    // Sheets
    @PostMapping("/sheets")
    @ResponseStatus(HttpStatus.CREATED)
    public CodingSheetResponse createSheet(@Valid @RequestBody CodingSheetRequest request) {
        return codingService.createSheet(request);
    }

    @PutMapping("/sheets/{sheetId}")
    public CodingSheetResponse updateSheet(@PathVariable Long sheetId, @Valid @RequestBody CodingSheetRequest request) {
        return codingService.updateSheet(sheetId, request);
    }

    @DeleteMapping("/sheets/{sheetId}")
    public MessageResponse deleteSheet(@PathVariable Long sheetId) {
        codingService.deleteSheet(sheetId);
        return new MessageResponse("Sheet deleted successfully");
    }

    // Patterns
    @PostMapping("/patterns")
    @ResponseStatus(HttpStatus.CREATED)
    public CodingPatternResponse createPattern(@Valid @RequestBody CodingPatternRequest request) {
        return codingService.createPattern(request);
    }

    @PutMapping("/patterns/{patternId}")
    public CodingPatternResponse updatePattern(@PathVariable Long patternId, @Valid @RequestBody CodingPatternRequest request) {
        return codingService.updatePattern(patternId, request);
    }

    @DeleteMapping("/patterns/{patternId}")
    public MessageResponse deletePattern(@PathVariable Long patternId) {
        codingService.deletePattern(patternId);
        return new MessageResponse("Pattern deleted successfully");
    }

    // Problems
    @PostMapping("/problems")
    @ResponseStatus(HttpStatus.CREATED)
    public CodingProblemDetailResponse createProblem(@Valid @RequestBody CodingProblemRequest request) {
        return codingService.createProblem(request);
    }

    @PutMapping("/problems/{problemId}")
    public CodingProblemDetailResponse updateProblem(@PathVariable Long problemId, @Valid @RequestBody CodingProblemRequest request) {
        return codingService.updateProblem(problemId, request);
    }

    @DeleteMapping("/problems/{problemId}")
    public MessageResponse deleteProblem(@PathVariable Long problemId) {
        codingService.deleteProblem(problemId);
        return new MessageResponse("Problem deleted successfully");
    }
}
