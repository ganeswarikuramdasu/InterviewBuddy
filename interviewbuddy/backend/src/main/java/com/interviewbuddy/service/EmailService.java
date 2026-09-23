package com.interviewbuddy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails (currently only email verification) via SMTP.
 *
 * Mail settings (host, username, password, etc.) are configured in
 * application.yml under spring.mail. For Gmail use an App Password as the
 * password (see docs/deployment.md or README "Email Verification Setup").
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:}")
    private String from;

    @Value("${app.mail.enabled:false}")
    private boolean enabled;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.mail.verify-path:/verify-email}")
    private String verifyPath;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Asynchronously sends an email verification link.
     *
     * @param recipient the recipient address
     * @param fullName  recipient display name (may be empty)
     * @param token     the one-time verification token
     */
    @Async
    public void sendVerificationEmail(String recipient, String fullName, String token) {
        if (!enabled) {
            log.warn("Mail disabled (app.mail.enabled=false); verification email for {} NOT sent.", recipient);
            return;
        }
        if (token == null || token.isBlank()) {
            log.warn("Cannot send verification email for {} without a token.", recipient);
            return;
        }
        String verifyLink = buildVerifyLink(token);
        String displayName = (fullName == null || fullName.isBlank()) ? "there" : fullName.split(" ")[0];

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from.isBlank() ? null : from);
        message.setTo(recipient);
        message.setSubject("Verify your InterviewBuddy account");
        message.setText(
                "Hi " + displayName + ",\n\n"
                + "Welcome to InterviewBuddy! Please confirm your email address by clicking the link below:\n\n"
                + verifyLink + "\n\n"
                + "This link expires in 24 hours. If you did not create an account, you can safely ignore this email.\n\n"
                + "Thanks,\nThe InterviewBuddy Team"
        );

        try {
            mailSender.send(message);
            log.info("Sent verification email to {}", recipient);
        } catch (RuntimeException ex) {
            log.error("Failed to send verification email to {}: {}", recipient, ex.getMessage());
        }
    }

    private String buildVerifyLink(String token) {
        String base = frontendUrl;
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        String path = verifyPath;
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return base + path + "?token=" + token;
    }
}
