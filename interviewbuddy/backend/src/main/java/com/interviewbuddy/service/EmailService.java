package com.interviewbuddy.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Sends transactional emails (currently only email verification) via the Brevo
 * (formerly Sendinblue) Transactional Email API.
 *
 * Configure BREVO_API_KEY (Settings > API Keys in the Brevo dashboard) and make
 * sure MAIL_FROM is a verified sender/domain (Settings > Senders & IPs).
 * MAIL_ENABLED must also be true to actually send.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private static final String BREVO_SEND_ENDPOINT = "/smtp/email";

    private final WebClient brevoClient;
    private final boolean brevoConfigured;
    private final boolean enabled;
    private final String from;
    private final String fromName;
    private final String frontendUrl;
    private final String verifyPath;

    public EmailService(WebClient.Builder webClientBuilder,
                        @Value("${app.brevo.base-url:https://api.brevo.com/v3}") String brevoBaseUrl,
                        @Value("${app.brevo.api-key:}") String brevoApiKey,
                        @Value("${app.mail.enabled:false}") boolean enabled,
                        @Value("${app.mail.from:noreply@interviewbuddy.com}") String from,
                        @Value("${app.mail.from-name:InterviewBuddy}") String fromName,
                        @Value("${app.frontend.url:http://localhost:5173}") String frontendUrl,
                        @Value("${app.mail.verify-path:/verify-email}") String verifyPath) {
        this.enabled = enabled;
        this.brevoConfigured = brevoApiKey != null && !brevoApiKey.isBlank();
        this.from = from;
        this.fromName = fromName;
        this.frontendUrl = frontendUrl;
        this.verifyPath = verifyPath;
        this.brevoClient = webClientBuilder
                .baseUrl(brevoBaseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("api-key", brevoApiKey)
                .build();
    }

    /**
     * Asynchronously sends an email verification link via the Brevo API.
     *
     * @param recipient the recipient address
     * @param fullName  recipient display name (may be empty)
     * @param token     the one-time verification token
     */
    @Async
    public void sendVerificationEmail(String recipient, String fullName, String token) {
        if (!enabled) {
            log.warn("Email disabled (app.mail.enabled=false); verification email for {} NOT sent.", recipient);
            return;
        }
        if (!brevoConfigured) {
            log.warn("BREVO_API_KEY not configured; verification email for {} NOT sent.", recipient);
            return;
        }
        if (from.isBlank()) {
            log.warn("MAIL_FROM not configured; verification email for {} NOT sent.", recipient);
            return;
        }
        if (token == null || token.isBlank()) {
            log.warn("Cannot send verification email for {} without a token.", recipient);
            return;
        }

        String verifyLink = buildVerifyLink(token);
        String displayName = (fullName == null || fullName.isBlank()) ? "there" : fullName.split(" ")[0];
        String text = "Hi " + displayName + ",\n\n"
                + "Welcome to InterviewBuddy! Please confirm your email address by clicking the link below:\n\n"
                + verifyLink + "\n\n"
                + "This link expires in 24 hours. If you did not create an account, you can safely ignore this email.\n\n"
                + "Thanks,\nThe InterviewBuddy Team";
        String html = "<p>Hi " + displayName + ",</p>"
                + "<p>Welcome to InterviewBuddy! Please confirm your email address by clicking the link below:</p>"
                + "<p><a href=\"" + verifyLink + "\">Verify my email address</a></p>"
                + "<p>This link expires in 24 hours. If you did not create an account, you can safely ignore this email.</p>"
                + "<p>Thanks,<br>The InterviewBuddy Team</p>";

        BrevoEmailRequest request = new BrevoEmailRequest(
                new Sender(from, fromName),
                List.of(new Recipient(recipient, displayName)),
                "Verify your InterviewBuddy account",
                text,
                html);

        try {
            brevoClient.post()
                    .uri(BREVO_SEND_ENDPOINT)
                    .bodyValue(request)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
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

    private record BrevoEmailRequest(Sender sender, List<Recipient> to,
                                     String subject, String textContent, String htmlContent) {}

    private record Sender(String email, String name) {}

    private record Recipient(String email, String name) {}
}