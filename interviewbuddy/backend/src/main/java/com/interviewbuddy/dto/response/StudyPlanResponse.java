package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudyPlanResponse {
    private Integer codingPerWeek;
    private Integer interviewsPerWeek;
    private Integer learningPerWeek;
    private List<StudyPlanItemResponse> items;
}
