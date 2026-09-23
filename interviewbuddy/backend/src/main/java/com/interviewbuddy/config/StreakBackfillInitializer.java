package com.interviewbuddy.config;

import com.interviewbuddy.service.InterviewStreakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Derives InterviewStreak practice days from existing COMPLETED interview
 * sessions on startup, so users do not start from zero after the feature is
 * added. Idempotent: it only inserts dates that do not already exist and never
 * modifies or deletes existing practice/session records.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class StreakBackfillInitializer implements CommandLineRunner {

    private final InterviewStreakService interviewStreakService;

    @Override
    public void run(String... args) {
        int created = interviewStreakService.backfillPracticeDays();
        log.info("InterviewStreak: derived {} practice day(s) from existing completed interviews.", created);
    }
}