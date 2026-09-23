package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.request.CrtQuestionRequest;
import com.interviewbuddy.dto.request.CrtTestRequest;
import com.interviewbuddy.dto.request.CrtTopicRequest;
import com.interviewbuddy.dto.response.CrtQuestionResponse;
import com.interviewbuddy.dto.response.CrtTestResponse;
import com.interviewbuddy.dto.response.CrtTopicResponse;
import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.service.CrtService;
import com.interviewbuddy.service.CrtTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/crt")
@RequiredArgsConstructor
public class AdminCrtController {

    private final CrtService crtService;
    private final CrtTestService crtTestService;

    // Topics
    @PostMapping("/topics")
    @ResponseStatus(HttpStatus.CREATED)
    public CrtTopicResponse createTopic(@Valid @RequestBody CrtTopicRequest request) {
        return crtService.createTopic(request);
    }

    @PutMapping("/topics/{topicId}")
    public CrtTopicResponse updateTopic(@PathVariable Long topicId, @Valid @RequestBody CrtTopicRequest request) {
        return crtService.updateTopic(topicId, request);
    }

    @DeleteMapping("/topics/{topicId}")
    public MessageResponse deleteTopic(@PathVariable Long topicId) {
        crtService.deleteTopic(topicId);
        return new MessageResponse("Topic deleted successfully");
    }

    // Questions
    @GetMapping("/topics/{topicId}/questions")
    public List<CrtQuestionResponse> listQuestions(@PathVariable Long topicId) {
        return crtService.listQuestionsForAdmin(topicId);
    }

    @PostMapping("/questions")
    @ResponseStatus(HttpStatus.CREATED)
    public CrtQuestionResponse createQuestion(@Valid @RequestBody CrtQuestionRequest request) {
        return crtService.createQuestion(request);
    }

    @PutMapping("/questions/{questionId}")
    public CrtQuestionResponse updateQuestion(@PathVariable Long questionId, @Valid @RequestBody CrtQuestionRequest request) {
        return crtService.updateQuestion(questionId, request);
    }

    @DeleteMapping("/questions/{questionId}")
    public MessageResponse deleteQuestion(@PathVariable Long questionId) {
        crtService.deleteQuestion(questionId);
        return new MessageResponse("Question deleted successfully");
    }

    // Tests
    @PostMapping("/tests")
    @ResponseStatus(HttpStatus.CREATED)
    public CrtTestResponse createTest(@Valid @RequestBody CrtTestRequest request) {
        return crtTestService.createTest(request);
    }

    @PutMapping("/tests/{testId}")
    public CrtTestResponse updateTest(@PathVariable Long testId, @Valid @RequestBody CrtTestRequest request) {
        return crtTestService.updateTest(testId, request);
    }

    @DeleteMapping("/tests/{testId}")
    public MessageResponse deleteTest(@PathVariable Long testId) {
        crtTestService.deleteTest(testId);
        return new MessageResponse("Test deleted successfully");
    }
}
