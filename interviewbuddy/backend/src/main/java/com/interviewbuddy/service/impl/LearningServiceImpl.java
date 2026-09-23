package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.LearningCategoryRequest;
import com.interviewbuddy.dto.request.LearningResourceRequest;
import com.interviewbuddy.dto.response.LearningCategoryResponse;
import com.interviewbuddy.dto.response.LearningResourceResponse;
import com.interviewbuddy.entity.LearningCategory;
import com.interviewbuddy.entity.LearningResource;
import com.interviewbuddy.entity.UserLearningProgress;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.LearningCategoryRepository;
import com.interviewbuddy.repository.LearningResourceRepository;
import com.interviewbuddy.repository.UserLearningProgressRepository;
import com.interviewbuddy.service.LearningService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningServiceImpl implements LearningService {

    private final LearningCategoryRepository categoryRepository;
    private final LearningResourceRepository resourceRepository;
    private final UserLearningProgressRepository progressRepository;

    @Override
    public List<LearningCategoryResponse> listCategories(Long currentUserId) {
        List<LearningCategory> categories;
        if (currentUserId == null) {
            categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        } else {
            categories = categoryRepository.findByUserIdOrderByDisplayOrderAsc(currentUserId);
        }
        return categories.stream()
                .map(c -> LearningCategoryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .description(c.getDescription())
                        .displayOrder(c.getDisplayOrder())
                        .resourceCount(currentUserId != null
                                ? resourceRepository.countByUserIdAndCategoryId(currentUserId, c.getId())
                                : resourceRepository.findByCategoryIdAndIsPublishedTrue(c.getId()).size())
                        .build())
                .toList();
    }

    @Override
    public List<LearningResourceResponse> listResources(Long currentUserId, Long categoryId) {
        if (currentUserId == null) return List.of();
        return resourceRepository.findByUserIdAndCategoryId(currentUserId, categoryId).stream()
                .map(r -> toResponse(r, currentUserId))
                .toList();
    }

    @Override
    public LearningResourceResponse getResource(Long currentUserId, Long resourceId) {
        LearningResource resource = findOwnedResource(resourceId, currentUserId);
        return toResponse(resource, currentUserId);
    }

    @Override
    @Transactional
    public void markCompleted(Long userId, Long resourceId) {
        findOwnedResource(resourceId, userId);
        UserLearningProgress progress = progressRepository.findByUserIdAndResourceId(userId, resourceId)
                .orElse(UserLearningProgress.builder().userId(userId).resourceId(resourceId).build());
        progress.setCompleted(!progress.getCompleted());
        progress.setCompletedAt(progress.getCompleted() ? LocalDateTime.now() : null);
        progressRepository.save(progress);
    }

    @Override
    @Transactional
    public LearningResourceResponse createUserResource(Long userId, LearningResourceRequest request) {
        findOwnedCategory(request.getCategoryId(), userId);
        LearningResource resource = buildResource(request);
        resource.setUserId(userId);
        resource.setIsPublished(true);
        return toResponse(resourceRepository.save(resource), userId);
    }

    @Override
    @Transactional
    public LearningResourceResponse updateUserResource(Long userId, Long resourceId, LearningResourceRequest request) {
        LearningResource resource = findOwnedResource(resourceId, userId);
        findOwnedCategory(request.getCategoryId(), userId);
        applyRequest(resource, request);
        return toResponse(resourceRepository.save(resource), userId);
    }

    @Override
    @Transactional
    public void deleteUserResource(Long userId, Long resourceId) {
        LearningResource resource = findOwnedResource(resourceId, userId);
        resourceRepository.delete(resource);
    }

    @Override
    @Transactional
    public LearningCategoryResponse createCategory(LearningCategoryRequest request) {
        LearningCategory category = LearningCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();
        category = categoryRepository.save(category);
        return LearningCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .resourceCount(0)
                .build();
    }

    @Override
    @Transactional
    public LearningCategoryResponse createUserCategory(Long userId, LearningCategoryRequest request) {
        LearningCategory category = LearningCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .displayOrder(0)
                .userId(userId)
                .build();
        category = categoryRepository.save(category);
        return LearningCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .resourceCount(0)
                .build();
    }

    @Override
    @Transactional
    public LearningCategoryResponse updateUserCategory(Long userId, Long categoryId, LearningCategoryRequest request) {
        LearningCategory category = findOwnedCategory(categoryId, userId);
        category.setName(request.getName());
        if (request.getDescription() != null) category.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());
        category = categoryRepository.save(category);
        return LearningCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .resourceCount(resourceRepository.countByUserIdAndCategoryId(userId, category.getId()))
                .build();
    }

    @Override
    @Transactional
    public void deleteUserCategory(Long userId, Long categoryId) {
        LearningCategory category = findOwnedCategory(categoryId, userId);
        resourceRepository.deleteByCategoryId(category.getId());
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public LearningResourceResponse createResource(LearningResourceRequest request) {
        LearningResource resource = buildResource(request);
        return toResponse(resourceRepository.save(resource), null);
    }

    @Override
    @Transactional
    public LearningResourceResponse updateResource(Long resourceId, LearningResourceRequest request) {
        LearningResource resource = findResourceForAdmin(resourceId);
        applyRequest(resource, request);
        return toResponse(resourceRepository.save(resource), null);
    }

    @Override
    @Transactional
    public void deleteResource(Long resourceId) {
        LearningResource resource = findResourceForAdmin(resourceId);
        resourceRepository.delete(resource);
    }

    private LearningResource buildResource(LearningResourceRequest request) {
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Learning category not found"));
        return LearningResource.builder()
                .categoryId(request.getCategoryId())
                .title(request.getTitle())
                .description(request.getDescription())
                .resourceType(request.getResourceType())
                .contentUrl(request.getContentUrl())
                .contentBody(request.getContentBody())
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .build();
    }

    private void applyRequest(LearningResource resource, LearningResourceRequest request) {
        categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Learning category not found"));
        resource.setCategoryId(request.getCategoryId());
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());
        resource.setResourceType(request.getResourceType());
        resource.setContentUrl(request.getContentUrl());
        resource.setContentBody(request.getContentBody());
        if (request.getIsPublished() != null) resource.setIsPublished(request.getIsPublished());
    }

    // A non-admin user may only access resources they created.
    private LearningResource findOwnedResource(Long id, Long userId) {
        LearningResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found with id: " + id));
        if (resource.getUserId() != null && !resource.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Learning resource not found with id: " + id);
        }
        if (resource.getUserId() == null) {
            throw new ResourceNotFoundException("Learning resource not found with id: " + id);
        }
        return resource;
    }

    private LearningResource findResourceForAdmin(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found with id: " + id));
    }

    // A non-admin user may only access topics they created.
    private LearningCategory findOwnedCategory(Long categoryId, Long userId) {
        LearningCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Learning topic not found with id: " + categoryId));
        if (category.getUserId() == null || !category.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Learning topic not found with id: " + categoryId);
        }
        return category;
    }

    private LearningResourceResponse toResponse(LearningResource r, Long currentUserId) {
        LearningCategory category = categoryRepository.findById(r.getCategoryId()).orElse(null);
        boolean completed = currentUserId != null && progressRepository.findByUserIdAndResourceId(currentUserId, r.getId())
                .map(UserLearningProgress::getCompleted).orElse(false);
        return LearningResourceResponse.builder()
                .id(r.getId())
                .categoryId(r.getCategoryId())
                .categoryName(category != null ? category.getName() : "Unknown")
                .title(r.getTitle())
                .description(r.getDescription())
                .resourceType(r.getResourceType().name())
                .contentUrl(r.getContentUrl())
                .contentBody(r.getContentBody())
                .completedByCurrentUser(completed)
                .build();
    }
}
