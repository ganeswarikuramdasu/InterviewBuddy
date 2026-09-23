package com.interviewbuddy.config;

import com.interviewbuddy.entity.User;
import com.interviewbuddy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates demo accounts on first startup so the platform is usable immediately,
 * as required by the project spec ("Sample Data"). Only runs if app.demo.seed-users=true
 * (default) and only inserts accounts that don't already exist, so it is safe to
 * restart the app repeatedly without duplicating or resetting data.
 *
 * Passwords are hashed here using the live BCryptPasswordEncoder bean rather than a
 * hand-computed hash in seed.sql, so they are guaranteed to be correct.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.demo.seed-users:true}")
    private boolean seedUsers;

    @Value("${app.demo.demo-password:Passw0rd!}")
    private String demoPassword;

    @Override
    public void run(String... args) {
        if (!seedUsers) {
            return;
        }

        createIfMissing("InterviewBuddy Admin", "admin@interviewbuddy.com", User.Role.ADMIN, "InterviewBuddy HQ", "Administration", 2020);
        createIfMissing("Asha Rao", "user@interviewbuddy.com", User.Role.USER, "JNTU Kakinada", "CSE", 2026);
        createIfMissing("Rahul Verma", "rahul.verma@interviewbuddy.com", User.Role.USER, "VNR VJIET", "IT", 2025);
        createIfMissing("Sneha Patil", "sneha.patil@interviewbuddy.com", User.Role.USER, "COEP Pune", "ECE", 2026);

        log.info("Demo accounts ready. Login with admin@interviewbuddy.com / user@interviewbuddy.com using password '{}'", demoPassword);
    }

    private void createIfMissing(String fullName, String email, User.Role role, String college, String branch, int gradYear) {
        if (userRepository.existsByEmail(email)) {
            return;
        }
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(demoPassword))
                .role(role)
                .college(college)
                .branch(branch)
                .graduationYear(gradYear)
                .enabled(true)
                .emailVerified(true)
                .build();
        userRepository.save(user);
    }
}
