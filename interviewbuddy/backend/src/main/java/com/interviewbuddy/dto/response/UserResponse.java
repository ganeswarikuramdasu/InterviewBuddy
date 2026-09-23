package com.interviewbuddy.dto.response;

import com.interviewbuddy.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private String college;
    private String branch;
    private Integer graduationYear;
    private Boolean emailVerified;
    private LocalDateTime createdAt;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .phone(u.getPhone())
                .college(u.getCollege())
                .branch(u.getBranch())
                .graduationYear(u.getGraduationYear())
                .emailVerified(u.getEmailVerified())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
