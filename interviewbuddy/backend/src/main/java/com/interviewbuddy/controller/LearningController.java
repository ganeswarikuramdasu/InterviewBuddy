package com.interviewbuddy.controller;

import com.interviewbuddy.dto.request.LearningCategoryRequest;
import com.interviewbuddy.dto.request.LearningResourceRequest;
import com.interviewbuddy.dto.response.LearningCategoryResponse;
import com.interviewbuddy.dto.response.LearningResourceResponse;
import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.security.UserPrincipal;
import com.interviewbuddy.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {

    private final LearningService learningService;

    @GetMapping("/categories")
    public List<LearningCategoryResponse> listCategories(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : null;
        return learningService.listCategories(userId);
    }

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public LearningCategoryResponse createCategory(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody LearningCategoryRequest request) {
        return learningService.createUserCategory(principal.getId(), request);
    }

    @PutMapping("/categories/{categoryId}")
    public LearningCategoryResponse updateCategory(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long categoryId,
                                                   @Valid @RequestBody LearningCategoryRequest request) {
        return learningService.updateUserCategory(principal.getId(), categoryId, request);
    }

    @DeleteMapping("/categories/{categoryId}")
    public MessageResponse deleteCategory(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long categoryId) {
        learningService.deleteUserCategory(principal.getId(), categoryId);
        return new MessageResponse("Learning topic deleted successfully");
    }

    @GetMapping("/categories/{categoryId}/resources")
    public List<LearningResourceResponse> listResources(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long categoryId) {
        Long userId = principal != null ? principal.getId() : null;
        return learningService.listResources(userId, categoryId);
    }

    @GetMapping("/resources/{resourceId}")
    public LearningResourceResponse getResource(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long resourceId) {
        Long userId = principal != null ? principal.getId() : null;
        return learningService.getResource(userId, resourceId);
    }

    @PostMapping("/resources")
    @ResponseStatus(HttpStatus.CREATED)
    public LearningResourceResponse createResource(@AuthenticationPrincipal UserPrincipal principal,
                                                   @Valid @RequestBody LearningResourceRequest request) {
        return learningService.createUserResource(principal.getId(), request);
    }

    @PutMapping("/resources/{resourceId}")
    public LearningResourceResponse updateResource(@AuthenticationPrincipal UserPrincipal principal,
                                                   @PathVariable Long resourceId,
                                                   @Valid @RequestBody LearningResourceRequest request) {
        return learningService.updateUserResource(principal.getId(), resourceId, request);
    }

    @DeleteMapping("/resources/{resourceId}")
    public MessageResponse deleteResource(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long resourceId) {
        learningService.deleteUserResource(principal.getId(), resourceId);
        return new MessageResponse("Learning resource deleted successfully");
    }

    @PostMapping("/resources/{resourceId}/complete")
    public MessageResponse markCompleted(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long resourceId) {
        learningService.markCompleted(principal.getId(), resourceId);
        return new MessageResponse("Resource marked as completed");
    }
}
