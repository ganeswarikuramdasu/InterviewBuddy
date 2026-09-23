package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.LearningCategoryRequest;
import com.interviewbuddy.dto.request.LearningResourceRequest;
import com.interviewbuddy.dto.response.LearningCategoryResponse;
import com.interviewbuddy.dto.response.LearningResourceResponse;

import java.util.List;

public interface LearningService {
    List<LearningCategoryResponse> listCategories(Long currentUserId);
    List<LearningResourceResponse> listResources(Long currentUserId, Long categoryId);
    LearningResourceResponse getResource(Long currentUserId, Long resourceId);
    void markCompleted(Long userId, Long resourceId);

    // User-managed topics (users create, rename, and delete their own topics)
    LearningCategoryResponse createUserCategory(Long userId, LearningCategoryRequest request);
    LearningCategoryResponse updateUserCategory(Long userId, Long categoryId, LearningCategoryRequest request);
    void deleteUserCategory(Long userId, Long categoryId);

    // User-managed resources (users add and maintain their own learning links)
    LearningResourceResponse createUserResource(Long userId, LearningResourceRequest request);
    LearningResourceResponse updateUserResource(Long userId, Long resourceId, LearningResourceRequest request);
    void deleteUserResource(Long userId, Long resourceId);

    // Admin
    LearningCategoryResponse createCategory(LearningCategoryRequest request);
    LearningResourceResponse createResource(LearningResourceRequest request);
    LearningResourceResponse updateResource(Long resourceId, LearningResourceRequest request);
    void deleteResource(Long resourceId);
}
