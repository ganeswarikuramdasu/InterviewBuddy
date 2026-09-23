package com.interviewbuddy.service;

import com.interviewbuddy.dto.response.InterviewStreakOverviewResponse;
import com.interviewbuddy.entity.InterviewSession;
import com.interviewbuddy.entity.InterviewStreakActivity;
import com.interviewbuddy.entity.SessionStatus;
import com.interviewbuddy.repository.InterviewSessionRepository;
import com.interviewbuddy.repository.InterviewStreakActivityRepository;
import com.interviewbuddy.service.impl.InterviewStreakServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for streak math and idempotent practice-day recording. No DB is
 * touched - the activity repository is mocked.
 */
@ExtendWith(MockitoExtension.class)
class InterviewStreakServiceImplTest {

    @Mock
    private InterviewStreakActivityRepository streakRepository;

    @Mock
    private InterviewSessionRepository sessionRepository;

    private InterviewStreakServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new InterviewStreakServiceImpl(streakRepository, sessionRepository);
    }

    @Test
    void newUser_hasZeroStreaks() {
        when(streakRepository.findByUserIdOrderByActivityDateAsc(1L)).thenReturn(List.of());

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isZero();
        assertThat(overview.getLongestStreak()).isZero();
        assertThat(overview.getTotalPracticeDays()).isZero();
        assertThat(overview.isTodayCompleted()).isFalse();
        assertThat(overview.getLastPracticeDate()).isNull();
    }

    @Test
    void threeConsecutiveDaysEndingToday_givesThree() {
        LocalDate today = LocalDate.now();
        streakDates(List.of(today.minusDays(2), today.minusDays(1), today));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isEqualTo(3);
        assertThat(overview.getLongestStreak()).isEqualTo(3);
        assertThat(overview.getTotalPracticeDays()).isEqualTo(3);
        assertThat(overview.isTodayCompleted()).isTrue();
    }

    @Test
    void streakEndingYesterday_stillCountsAsCurrent() {
        LocalDate today = LocalDate.now();
        streakDates(List.of(today.minusDays(3), today.minusDays(2), today.minusDays(1)));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isEqualTo(3);
        assertThat(overview.isTodayCompleted()).isFalse();
    }

    @Test
    void missedWholeDay_breaksCurrentStreak() {
        LocalDate today = LocalDate.now();
        // Practiced today and 2 days ago, but not yesterday -> streak of 1, longest 1.
        streakDates(List.of(today.minusDays(2), today));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isEqualTo(1);
        assertThat(overview.getLongestStreak()).isEqualTo(1);
    }

    @Test
    void gapOfTwoDays_resetsCurrentStreakToZero() {
        LocalDate today = LocalDate.now();
        // Last practice was 2+ days ago -> current streak broken.
        streakDates(List.of(today.minusDays(8), today.minusDays(7), today.minusDays(2)));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isZero();
        assertThat(overview.getLongestStreak()).isEqualTo(2);
    }

    @Test
    void historicalLongestBeatsCurrentStreak() {
        LocalDate today = LocalDate.now();
        // 5 consecutive days some time ago, but last practice = yesterday with
        // a gap before it -> current streak starts again.
        streakDates(List.of(
                today.minusDays(10), today.minusDays(9), today.minusDays(8),
                today.minusDays(7), today.minusDays(6), // 5-day historical run
                today.minusDays(1)));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getCurrentStreak()).isEqualTo(1);
        assertThat(overview.getLongestStreak()).isEqualTo(5);
    }

    @Test
    void duplicateActivityRows_sameDate_countAsOneDay() {
        LocalDate today = LocalDate.now();
        InterviewStreakActivity a1 = activity(today, 101L);
        InterviewStreakActivity a2 = activity(today, 102L);
        when(streakRepository.findByUserIdOrderByActivityDateAsc(1L)).thenReturn(List.of(a1, a2));

        InterviewStreakOverviewResponse overview = service.getOverview(1L);

        assertThat(overview.getTotalPracticeDays()).isEqualTo(1);
        assertThat(overview.getCurrentStreak()).isEqualTo(1);
    }

    @Test
    void recordCompletedSession_skipsWhenDayAlreadyExists() {
        when(streakRepository.existsByUserIdAndActivityDate(1L, LocalDate.now())).thenReturn(true);

        service.recordCompletedSession(1L, 55L, LocalDate.now());

        verify(streakRepository, never()).save(any(InterviewStreakActivity.class));
    }

    @Test
    void recordCompletedSession_savesOnceForNewDay() {
        LocalDate date = LocalDate.now();
        when(streakRepository.existsByUserIdAndActivityDate(1L, date)).thenReturn(false);

        service.recordCompletedSession(1L, 55L, date);

        verify(streakRepository, times(1)).save(any(InterviewStreakActivity.class));
    }

    @Test
    void recordCompletedSession_survivesConstraintViolation() {
        LocalDate date = LocalDate.now();
        when(streakRepository.existsByUserIdAndActivityDate(1L, date)).thenReturn(false);
        when(streakRepository.save(any(InterviewStreakActivity.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate day"));

        service.recordCompletedSession(1L, 55L, date);

        verify(streakRepository, times(1)).save(any(InterviewStreakActivity.class));
    }

    @Test
    void backfill_derivesOneDayPerCompletedSessionDate() {
        LocalDate d1 = LocalDate.now().minusDays(3);
        LocalDate d2 = LocalDate.now().minusDays(2);
        InterviewSession s1 = session(1L, d1);
        InterviewSession s2 = session(2L, d2);
        when(sessionRepository.findByStatus(SessionStatus.COMPLETED)).thenReturn(List.of(s1, s2));
        when(streakRepository.existsByUserIdAndActivityDate(anyLong(), any(LocalDate.class))).thenReturn(false);

        int created = service.backfillPracticeDays();

        assertThat(created).isEqualTo(2);
        verify(streakRepository, times(2)).save(any(InterviewStreakActivity.class));
    }

    @Test
    void backfill_isIdempotentWhenDaysAlreadyExist() {
        LocalDate d1 = LocalDate.now().minusDays(3);
        InterviewSession s1 = session(1L, d1);
        when(sessionRepository.findByStatus(SessionStatus.COMPLETED)).thenReturn(List.of(s1));
        when(streakRepository.existsByUserIdAndActivityDate(1L, d1)).thenReturn(true);

        int created = service.backfillPracticeDays();

        assertThat(created).isZero();
        verify(streakRepository, never()).save(any(InterviewStreakActivity.class));
    }

    private void streakDates(List<LocalDate> dates) {
        List<InterviewStreakActivity> activities = dates.stream().map(d -> activity(d, 1L)).toList();
        when(streakRepository.findByUserIdOrderByActivityDateAsc(1L)).thenReturn(activities);
    }

    private static InterviewStreakActivity activity(LocalDate date, Long referenceId) {
        return InterviewStreakActivity.builder()
                .id(1L)
                .userId(1L)
                .activityDate(date)
                .activityType("INTERVIEW")
                .activityReferenceId(referenceId)
                .completedAt(LocalDateTime.now())
                .build();
    }

    private static InterviewSession session(Long userId, LocalDate completedDate) {
        InterviewSession session = new InterviewSession();
        session.setId(userId * 10);
        session.setUserId(userId);
        session.setStatus(SessionStatus.COMPLETED);
        session.setCompletedAt(completedDate.atStartOfDay());
        return session;
    }
}