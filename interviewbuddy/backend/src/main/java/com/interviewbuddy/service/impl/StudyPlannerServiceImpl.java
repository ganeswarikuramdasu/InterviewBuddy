package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.StudyGoalsRequest;
import com.interviewbuddy.dto.request.StudyPlanItemRequest;
import com.interviewbuddy.dto.response.StudyPlanItemResponse;
import com.interviewbuddy.dto.response.StudyPlanResponse;
import com.interviewbuddy.entity.StudyGoals;
import com.interviewbuddy.entity.StudyPlanItem;
import com.interviewbuddy.exception.BadRequestException;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.StudyGoalsRepository;
import com.interviewbuddy.repository.StudyPlanItemRepository;
import com.interviewbuddy.service.StudyPlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPlannerServiceImpl implements StudyPlannerService {

    private final StudyGoalsRepository goalsRepository;
    private final StudyPlanItemRepository itemRepository;

    @Override
    @Transactional
    public StudyPlanResponse getPlan(Long userId) {
        StudyGoals goals = goalsRepository.findByUserId(userId).orElseGet(() -> {
            StudyGoals g = StudyGoals.builder().userId(userId).build();
            return goalsRepository.save(g);
        });
        return map(goals, itemRepository.findByUserIdOrderByDayOfWeekAscCreatedAtAsc(userId));
    }

    @Override
    @Transactional
    public StudyPlanResponse updateGoals(Long userId, StudyGoalsRequest request) {
        StudyGoals goals = goalsRepository.findByUserId(userId)
                .orElseGet(() -> StudyGoals.builder().userId(userId).build());

        if (request.getCodingPerWeek() != null) goals.setCodingPerWeek(request.getCodingPerWeek());
        if (request.getInterviewsPerWeek() != null) goals.setInterviewsPerWeek(request.getInterviewsPerWeek());
        if (request.getLearningPerWeek() != null) goals.setLearningPerWeek(request.getLearningPerWeek());

        goals = goalsRepository.save(goals);
        return map(goals, itemRepository.findByUserIdOrderByDayOfWeekAscCreatedAtAsc(userId));
    }

    @Override
    @Transactional
    public StudyPlanResponse createItem(Long userId, StudyPlanItemRequest request) {
        StudyGoals goals = getOrCreateGoals(userId);
        StudyPlanItem item = StudyPlanItem.builder()
                .userId(userId)
                .title(request.getTitle().trim())
                .type(request.getType())
                .dayOfWeek(request.getDayOfWeek())
                .time(request.getTime())
                .durationMinutes(request.getDurationMinutes())
                .done(false)
                .build();
        itemRepository.save(item);
        return map(goals, itemRepository.findByUserIdOrderByDayOfWeekAscCreatedAtAsc(userId));
    }

    @Override
    @Transactional
    public StudyPlanResponse updateItem(Long userId, Long itemId, StudyPlanItemRequest request) {
        StudyPlanItem item = requireOwned(userId, itemId);
        item.setTitle(request.getTitle().trim());
        item.setType(request.getType());
        item.setDayOfWeek(request.getDayOfWeek());
        item.setTime(request.getTime());
        item.setDurationMinutes(request.getDurationMinutes());
        itemRepository.save(item);
        return planFor(userId);
    }

    @Override
    @Transactional
    public StudyPlanResponse toggleItem(Long userId, Long itemId) {
        StudyPlanItem item = requireOwned(userId, itemId);
        item.setDone(!Boolean.TRUE.equals(item.getDone()));
        itemRepository.save(item);
        return planFor(userId);
    }

    @Override
    @Transactional
    public StudyPlanResponse deleteItem(Long userId, Long itemId) {
        StudyPlanItem item = requireOwned(userId, itemId);
        itemRepository.delete(item);
        return planFor(userId);
    }

    private StudyPlanItem requireOwned(Long userId, Long itemId) {
        StudyPlanItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Study plan item not found"));
        if (!item.getUserId().equals(userId)) {
            throw new BadRequestException("This plan item does not belong to the current user");
        }
        return item;
    }

    private StudyGoals getOrCreateGoals(Long userId) {
        return goalsRepository.findByUserId(userId)
                .orElseGet(() -> goalsRepository.save(StudyGoals.builder().userId(userId).build()));
    }

    private StudyPlanResponse planFor(Long userId) {
        return map(getOrCreateGoals(userId), itemRepository.findByUserIdOrderByDayOfWeekAscCreatedAtAsc(userId));
    }

    private StudyPlanResponse map(StudyGoals goals, List<StudyPlanItem> items) {
        List<StudyPlanItemResponse> dtos = items.stream()
                .map(i -> StudyPlanItemResponse.builder()
                        .id(i.getId())
                        .title(i.getTitle())
                        .type(i.getType() != null ? i.getType().name() : "OTHER")
                        .dayOfWeek(i.getDayOfWeek())
                        .time(i.getTime())
                        .durationMinutes(i.getDurationMinutes())
                        .done(Boolean.TRUE.equals(i.getDone()))
                        .build())
                .collect(Collectors.toList());

        return StudyPlanResponse.builder()
                .codingPerWeek(goals.getCodingPerWeek())
                .interviewsPerWeek(goals.getInterviewsPerWeek())
                .learningPerWeek(goals.getLearningPerWeek())
                .items(dtos)
                .build();
    }
}
