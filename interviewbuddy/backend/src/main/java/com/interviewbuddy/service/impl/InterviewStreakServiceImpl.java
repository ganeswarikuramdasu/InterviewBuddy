package com.interviewbuddy.service.impl;

import com.interviewbuddy.dto.response.InterviewStreakCalendarResponse;
import com.interviewbuddy.dto.response.InterviewStreakOverviewResponse;
import com.interviewbuddy.entity.InterviewSession;
import com.interviewbuddy.entity.InterviewStreakActivity;
import com.interviewbuddy.entity.SessionStatus;
import com.interviewbuddy.repository.InterviewSessionRepository;
import com.interviewbuddy.repository.InterviewStreakActivityRepository;
import com.interviewbuddy.service.InterviewStreakService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Streak calculation uses the user's calendar day (server-local, matching how
 * the rest of InterviewBuddy stores LocalDateTime timestamps - UTC is never
 * used as a day boundary, so a user cannot lose/gain a streak at midnight).
 *
 * A practice day is a distinct calendar date in interview_streak_activity.
 * Current streak = consecutive practice days ending today or, if today is not
 * done yet, ending the most recent practice day (today/yesterday); a gap of a
 * whole missed calendar day resets it. Longest streak = the largest run of
 * consecutive practice days ever recorded.
 */
@Service
@RequiredArgsConstructor
public class InterviewStreakServiceImpl implements InterviewStreakService {

    private static final Logger log = LoggerFactory.getLogger(InterviewStreakServiceImpl.class);

    private final InterviewStreakActivityRepository streakRepository;
    private final InterviewSessionRepository sessionRepository;

    @Override
    public InterviewStreakOverviewResponse getOverview(Long userId) {
        List<LocalDate> dates = practiceDates(userId);
        LocalDate today = LocalDate.now();

        return InterviewStreakOverviewResponse.builder()
                .currentStreak(currentStreak(dates, today))
                .longestStreak(longestStreak(dates))
                .totalPracticeDays(dates.size())
                .todayCompleted(dates.contains(today))
                .lastPracticeDate(dates.isEmpty() ? null : dates.get(dates.size() - 1))
                .today(today)
                .build();
    }

    @Override
    public InterviewStreakCalendarResponse getCalendar(Long userId, int months) {
        LocalDate today = LocalDate.now();
        LocalDate from = today.minusMonths(Math.max(1, months)).withDayOfMonth(1);

        Map<LocalDate, Long> days = new LinkedHashMap<>();
        streakRepository.findByUserIdAndActivityDateGreaterThanEqual(userId, from).forEach(a ->
                days.putIfAbsent(a.getActivityDate(), a.getActivityReferenceId()));

        List<InterviewStreakCalendarResponse.PracticeDay> practiceDays = days.entrySet().stream()
                .map(e -> InterviewStreakCalendarResponse.PracticeDay.builder()
                        .date(e.getKey())
                        .referenceId(e.getValue())
                        .build())
                .toList();

        return InterviewStreakCalendarResponse.builder()
                .today(today)
                .practiceDays(practiceDays)
                .build();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordCompletedSession(Long userId, Long referenceId, LocalDate completedDate) {
        try {
            if (streakRepository.existsByUserIdAndActivityDate(userId, completedDate)) {
                return;
            }
            streakRepository.save(InterviewStreakActivity.builder()
                    .userId(userId)
                    .activityDate(completedDate)
                    .activityType("INTERVIEW")
                    .activityReferenceId(referenceId)
                    .completedAt(LocalDateTime.now())
                    .build());
        } catch (DataIntegrityViolationException ex) {
            // Another concurrent completion already recorded this calendar day -
            // the UNIQUE(user_id, activity_date) constraint keeps it at one day.
            log.debug("InterviewStreak practice day already recorded for user {} on {}", userId, completedDate);
        } catch (Exception ex) {
            log.warn("Could not record InterviewStreak practice day for user {} on {}: {}",
                    userId, completedDate, ex.getMessage());
        }
    }

    @Override
    @Transactional
    public int backfillPracticeDays() {
        int created = 0;
        Set<Long> seenKeys = new HashSet<>();
        for (InterviewSession session : sessionRepository.findByStatus(SessionStatus.COMPLETED)) {
            if (session.getCompletedAt() == null) {
                continue;
            }
            LocalDate date = session.getCompletedAt().toLocalDate();
            Long key = session.getUserId() * 1000000L + date.toEpochDay();
            if (!seenKeys.add(key) || streakRepository.existsByUserIdAndActivityDate(session.getUserId(), date)) {
                continue;
            }
            streakRepository.save(InterviewStreakActivity.builder()
                    .userId(session.getUserId())
                    .activityDate(date)
                    .activityType("INTERVIEW")
                    .activityReferenceId(session.getId())
                    .completedAt(session.getCompletedAt())
                    .build());
            created++;
        }
        return created;
    }

    private List<LocalDate> practiceDates(Long userId) {
        return streakRepository.findByUserIdOrderByActivityDateAsc(userId).stream()
                .map(InterviewStreakActivity::getActivityDate)
                .distinct()
                .toList();
    }

    private int currentStreak(List<LocalDate> dates, LocalDate today) {
        if (dates.isEmpty()) {
            return 0;
        }
        LocalDate mostRecent = dates.get(dates.size() - 1);
        // A whole missed calendar day breaks the streak; the most recent
        // practice day may be today or yesterday and still count as current.
        if (mostRecent.isBefore(today.minusDays(1))) {
            return 0;
        }
        Set<LocalDate> set = new HashSet<>(dates);
        int count = 0;
        LocalDate cursor = mostRecent;
        while (set.contains(cursor)) {
            count++;
            cursor = cursor.minusDays(1);
        }
        return count;
    }

    private int longestStreak(List<LocalDate> dates) {
        if (dates.isEmpty()) {
            return 0;
        }
        int longest = 1;
        int run = 1;
        LocalDate previous = dates.get(0);
        for (int i = 1; i < dates.size(); i++) {
            LocalDate current = dates.get(i);
            if (current.isEqual(previous.plusDays(1))) {
                run++;
            } else {
                run = 1;
            }
            longest = Math.max(longest, run);
            previous = current;
        }
        return longest;
    }
}