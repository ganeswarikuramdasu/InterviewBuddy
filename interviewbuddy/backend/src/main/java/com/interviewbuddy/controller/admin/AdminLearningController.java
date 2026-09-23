package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.request.LearningCategoryRequest;
import com.interviewbuddy.dto.request.LearningResourceRequest;
import com.interviewbuddy.dto.response.LearningCategoryResponse;
import com.interviewbuddy.dto.response.LearningResourceResponse;
import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.service.LearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/learning")
@RequiredArgsConstructor
public class AdminLearningController {

    private final LearningService learningService;

    @PostMapping("/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public LearningCategoryResponse createCategory(@Valid @RequestBody LearningCategoryRequest request) {
        return learningService.createCategory(request);
    }

    @PostMapping("/resources")
    @ResponseStatus(HttpStatus.CREATED)
    public LearningResourceResponse createResource(@Valid @RequestBody LearningResourceRequest request) {
        return learningService.createResource(request);
    }

    @PutMapping("/resources/{resourceId}")
    public LearningResourceResponse updateResource(@PathVariable Long resourceId, @Valid @RequestBody LearningResourceRequest request) {
        return learningService.updateResource(resourceId, request);
    }

    @DeleteMapping("/resources/{resourceId}")
    public MessageResponse deleteResource(@PathVariable Long resourceId) {
        learningService.deleteResource(resourceId);
        return new MessageResponse("Learning resource deleted successfully");
    }
}
