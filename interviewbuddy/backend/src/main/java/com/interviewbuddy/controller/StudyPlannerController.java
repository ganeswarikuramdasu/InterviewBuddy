package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.StudyGoalsRequest;
import com.interviewbuddy.dto.request.StudyPlanItemRequest;
import com.interviewbuddy.dto.response.StudyPlanResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.StudyPlannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study-plan")
@RequiredArgsConstructor
public class StudyPlannerController {

    private final StudyPlannerService studyPlannerService;

    @GetMapping
    public StudyPlanResponse getPlan(@AuthenticationPrincipal UserPrincipal principal) {
        return studyPlannerService.getPlan(principal.getId());
    }

    @PutMapping("/goals")
    public StudyPlanResponse updateGoals(@AuthenticationPrincipal UserPrincipal principal,
                                         @Valid @RequestBody StudyGoalsRequest request) {
        return studyPlannerService.updateGoals(principal.getId(), request);
    }

    @PostMapping("/items")
    public StudyPlanResponse createItem(@AuthenticationPrincipal UserPrincipal principal,
                                        @Valid @RequestBody StudyPlanItemRequest request) {
        return studyPlannerService.createItem(principal.getId(), request);
    }

    @PutMapping("/items/{itemId}")
    public StudyPlanResponse updateItem(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long itemId,
                                        @Valid @RequestBody StudyPlanItemRequest request) {
        return studyPlannerService.updateItem(principal.getId(), itemId, request);
    }

    @PatchMapping("/items/{itemId}/toggle")
    public StudyPlanResponse toggleItem(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long itemId) {
        return studyPlannerService.toggleItem(principal.getId(), itemId);
    }

    @DeleteMapping("/items/{itemId}")
    public StudyPlanResponse deleteItem(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long itemId) {
        return studyPlannerService.deleteItem(principal.getId(), itemId);
    }
}
