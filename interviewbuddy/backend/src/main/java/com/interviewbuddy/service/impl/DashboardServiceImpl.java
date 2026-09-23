package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.response.AdminDashboardResponse;
import com.interviewbuddy.dto.response.UserDashboardResponse;
import com.interviewbuddy.entity.*;
import com.interviewbuddy.exception.ResourceNotFoundException;
import com.interviewbuddy.repository.*;
import com.interviewbuddy.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;

    private final CrtPracticeAttemptRepository crtPracticeAttemptRepository;
    private final CrtTestAttemptRepository crtTestAttemptRepository;
    private final CrtQuestionRepository crtQuestionRepository;

    private final SubmissionRepository submissionRepository;
    private final UserSolvedProblemRepository userSolvedProblemRepository;
    private final UserProblemProgressRepository userProblemProgressRepository;
    private final CodingProblemRepository codingProblemRepository;

    private final InterviewSessionRepository interviewSessionRepository;

    private final LearningResourceRepository learningResourceRepository;
    private final UserLearningProgressRepository userLearningProgressRepository;

    private static final DateTimeFormatter TS_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public UserDashboardResponse getUserDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long crtAttempts = crtPracticeAttemptRepository.countByUserId(userId);
        long crtCorrect = crtPracticeAttemptRepository.countByUserIdAndIsCorrectTrue(userId);
        double crtAccuracy = crtAttempts == 0 ? 0 : Math.round((crtCorrect * 10000.0) / crtAttempts) / 100.0;

        List<CrtTestAttempt> testAttempts = crtTestAttemptRepository.findByUserIdOrderByStartedAtDesc(userId).stream()
                .filter(a -> a.getStatus() == AttemptStatus.SUBMITTED)
                .toList();
        double avgTestScore = testAttempts.isEmpty() ? 0 :
                Math.round(testAttempts.stream().mapToInt(CrtTestAttempt::getScore).average().orElse(0) * 100) / 100.0;

        long solvedCount = userProblemProgressRepository.countByUserIdAndStatus(userId, CodingStatus.SOLVED);
        long totalSubmissions = submissionRepository.countByUserId(userId);

        Map<String, Long> solvedByDifficulty = new HashMap<>();
        for (Long problemId : userProblemProgressRepository.findProblemIdsByUserAndStatus(userId, CodingStatus.SOLVED)) {
            codingProblemRepository.findById(problemId).ifPresent(p ->
                    solvedByDifficulty.merge(p.getDifficulty().name(), 1L, Long::sum));
        }

        List<InterviewSession> interviews = interviewSessionRepository.findByUserIdOrderByStartedAtDesc(userId).stream()                .filter(s -> s.getStatus() == SessionStatus.COMPLETED)
                .toList();
        double avgInterviewScore = interviews.isEmpty() ? 0 :
                Math.round(interviews.stream()
                        .mapToDouble(s -> s.getOverallScore() != null ? s.getOverallScore().doubleValue() : 0)
                        .average().orElse(0) * 100) / 100.0;

        long learningCompleted = userLearningProgressRepository.countByUserIdAndCompletedTrue(userId);
        long totalLearningResources = learningResourceRepository.countByIsPublishedTrue();

        List<UserDashboardResponse.RecentActivity> recent = new java.util.ArrayList<>();
        testAttempts.stream().limit(3).forEach(a -> recent.add(UserDashboardResponse.RecentActivity.builder()
                .type("CRT_TEST")
                .description("Scored " + a.getScore() + "% on a CRT test")
                .timestamp(a.getSubmittedAt() != null ? a.getSubmittedAt().format(TS_FORMAT) : "")
                .build()));
        submissionRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 3)).forEach(s ->
                recent.add(UserDashboardResponse.RecentActivity.builder()
                        .type("SUBMISSION")
                        .description("Submission status: " + s.getStatus())
                        .timestamp(s.getCreatedAt().format(TS_FORMAT))
                        .build()));
        interviews.stream().limit(2).forEach(s -> recent.add(UserDashboardResponse.RecentActivity.builder()
                .type("INTERVIEW")
                .description("Completed a " + s.getRole() + " interview - score " + s.getOverallScore())
                .timestamp(s.getCompletedAt() != null ? s.getCompletedAt().format(TS_FORMAT) : "")
                .build()));

        return UserDashboardResponse.builder()
                .fullName(user.getFullName())
                .crtPracticeAttempts(crtAttempts)
                .crtPracticeCorrect(crtCorrect)
                .crtAccuracy(crtAccuracy)
                .crtTestsTaken(testAttempts.size())
                .crtAverageTestScore(avgTestScore)
                .problemsSolved(solvedCount)
                .totalSubmissions(totalSubmissions)
                .solvedByDifficulty(solvedByDifficulty)
                .interviewsCompleted(interviews.size())
                .averageInterviewScore(avgInterviewScore)
                .learningResourcesCompleted(learningCompleted)
                .totalLearningResources(totalLearningResources)
                .recentActivity(recent)
                .build();
    }

    @Override
    public AdminDashboardResponse getAdminDashboard() {
        long totalUsers = userRepository.countByRole(User.Role.USER);
        long totalAdmins = userRepository.countByRole(User.Role.ADMIN);

        List<AdminDashboardResponse.RecentUser> recentUsers = userRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(u -> AdminDashboardResponse.RecentUser.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .createdAt(u.getCreatedAt() != null ? u.getCreatedAt().format(TS_FORMAT) : "")
                        .build())
                .toList();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalAdmins(totalAdmins)
                .totalCodingProblems(codingProblemRepository.count())
                .totalCrtQuestions(crtQuestionRepository.count())
                .totalInterviewSessions(interviewSessionRepository.count())
                .totalLearningResources(learningResourceRepository.count())
                .totalSubmissions(submissionRepository.count())
                .recentRegistrations(recentUsers)
                .build();
    }
}
