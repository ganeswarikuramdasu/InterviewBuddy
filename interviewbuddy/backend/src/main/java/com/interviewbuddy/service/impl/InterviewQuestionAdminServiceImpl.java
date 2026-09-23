package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.request.InterviewQuestionAdminRequest;
import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.InterviewQuestionRepository;
import com.interviewbuddy.service.InterviewQuestionAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewQuestionAdminServiceImpl implements InterviewQuestionAdminService {

    private final InterviewQuestionRepository repository;

    @Override
    public List<InterviewQuestion> list(String role) {
        return (role == null || role.isBlank()) ? repository.findAll() : repository.findByRole(role);
    }

    @Override
    @Transactional
    public InterviewQuestion create(InterviewQuestionAdminRequest request) {
        InterviewQuestion question = InterviewQuestion.builder()
                .role(request.getRole())
                .interviewType(request.getInterviewType())
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : DifficultyLevel.MEDIUM)
                .questionText(request.getQuestionText())
                .modelAnswerNotes(request.getModelAnswerNotes())
                .build();
        return repository.save(question);
    }

    @Override
    @Transactional
    public InterviewQuestion update(Long id, InterviewQuestionAdminRequest request) {
        InterviewQuestion question = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview question not found with id: " + id));
        question.setRole(request.getRole());
        question.setInterviewType(request.getInterviewType());
        if (request.getDifficulty() != null) question.setDifficulty(request.getDifficulty());
        question.setQuestionText(request.getQuestionText());
        question.setModelAnswerNotes(request.getModelAnswerNotes());
        return repository.save(question);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Interview question not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
