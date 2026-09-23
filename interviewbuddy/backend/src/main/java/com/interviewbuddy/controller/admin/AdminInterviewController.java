package com.interviewbuddy.controller.admin;

import com.interviewbuddy.dto.request.InterviewQuestionAdminRequest;
import com.interviewbuddy.dto.response.MessageResponse;
import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.service.InterviewQuestionAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/interviews/questions")
@RequiredArgsConstructor
public class AdminInterviewController {

    private final InterviewQuestionAdminService adminService;

    @GetMapping
    public List<InterviewQuestion> list(@RequestParam(required = false) String role) {
        return adminService.list(role);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InterviewQuestion create(@Valid @RequestBody InterviewQuestionAdminRequest request) {
        return adminService.create(request);
    }

    @PutMapping("/{id}")
    public InterviewQuestion update(@PathVariable Long id, @Valid @RequestBody InterviewQuestionAdminRequest request) {
        return adminService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        adminService.delete(id);
        return new MessageResponse("Interview question deleted successfully");
    }
}
