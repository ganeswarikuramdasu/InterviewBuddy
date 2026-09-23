package com.interviewbuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InterviewBuddyApplication {
    public static void main(String[] args) {
        SpringApplication.run(InterviewBuddyApplication.class, args);
    }
}
