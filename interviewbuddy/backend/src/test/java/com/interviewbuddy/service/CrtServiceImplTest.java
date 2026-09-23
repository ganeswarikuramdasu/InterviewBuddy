package com.interviewbuddy.service;

import com.interviewbuddy.dto.request.CrtPracticeSubmitRequest;
import com.interviewbuddy.dto.response.CrtPracticeResultResponse;
import com.interviewbuddy.entity.CrtQuestion;
import com.interviewbuddy.entity.DifficultyLevel;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.impl.CrtServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrtServiceImplTest {

    @Mock private CrtCategoryRepository categoryRepository;
    @Mock private CrtTopicRepository topicRepository;
    @Mock private CrtQuestionRepository questionRepository;
    @Mock private CrtPracticeAttemptRepository practiceAttemptRepository;

    @InjectMocks
    private CrtServiceImpl crtService;

    @Test
    void submitPractice_marksCorrectAnswer_correctly() {
        CrtQuestion question = CrtQuestion.builder()
                .id(10L)
                .topicId(1L)
                .categoryId(1L)
                .questionText("What is 2+2?")
                .optionA("3").optionB("4").optionC("5").optionD("6")
                .correctOption("B")
                .explanation("2+2=4")
                .difficulty(DifficultyLevel.EASY)
                .build();

        when(questionRepository.findById(10L)).thenReturn(Optional.of(question));
        when(practiceAttemptRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(practiceAttemptRepository.findByUserId(5L)).thenReturn(List.of());

        CrtPracticeSubmitRequest request = new CrtPracticeSubmitRequest();
        request.setQuestionId(10L);
        request.setSelectedOption("B");

        CrtPracticeResultResponse result = crtService.submitPractice(5L, request);

        assertTrue(result.isCorrect());
        assertEquals("B", result.getCorrectOption());
    }

    @Test
    void submitPractice_marksIncorrectAnswer_correctly() {
        CrtQuestion question = CrtQuestion.builder()
                .id(11L).topicId(1L).categoryId(1L)
                .questionText("What is 2+2?")
                .optionA("3").optionB("4").optionC("5").optionD("6")
                .correctOption("B")
                .difficulty(DifficultyLevel.EASY)
                .build();

        when(questionRepository.findById(11L)).thenReturn(Optional.of(question));
        when(practiceAttemptRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(practiceAttemptRepository.findByUserId(5L)).thenReturn(List.of());

        CrtPracticeSubmitRequest request = new CrtPracticeSubmitRequest();
        request.setQuestionId(11L);
        request.setSelectedOption("A");

        CrtPracticeResultResponse result = crtService.submitPractice(5L, request);

        assertFalse(result.isCorrect());
    }

    @Test
    void submitPractice_throwsNotFound_whenQuestionMissing() {
        when(questionRepository.findById(999L)).thenReturn(Optional.empty());

        CrtPracticeSubmitRequest request = new CrtPracticeSubmitRequest();
        request.setQuestionId(999L);
        request.setSelectedOption("A");

        assertThrows(ResourceNotFoundException.class, () -> crtService.submitPractice(5L, request));
    }
}
