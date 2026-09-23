package com.interviewbuddy.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodingPatternResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private Integer position;
    private long problemCount;
}
