package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.StudyGoalsRequest;
import com.interviewbuddy.dto.request.StudyPlanItemRequest;
import com.interviewbuddy.dto.response.StudyPlanResponse;

public interface StudyPlannerService {
    StudyPlanResponse getPlan(Long userId);
    StudyPlanResponse updateGoals(Long userId, StudyGoalsRequest request);
    StudyPlanResponse createItem(Long userId, StudyPlanItemRequest request);
    StudyPlanResponse updateItem(Long userId, Long itemId, StudyPlanItemRequest request);
    StudyPlanResponse toggleItem(Long userId, Long itemId);
    StudyPlanResponse deleteItem(Long userId, Long itemId);
}
