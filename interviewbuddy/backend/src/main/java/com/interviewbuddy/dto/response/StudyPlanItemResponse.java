package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPlanItemResponse {
    private Long id;
    private String title;
    private String type;
    private Integer dayOfWeek;
    private String time;
    private Integer durationMinutes;
    private Boolean done;
}
