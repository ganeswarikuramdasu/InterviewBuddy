package com.interviewbuddy.repository;

import com.interviewbuddy.entity.InterviewQuestion;
import com.interviewbuddy.entity.InterviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findByRoleAndInterviewType(String role, InterviewType type);
    List<InterviewQuestion> findByRole(String role);
}
