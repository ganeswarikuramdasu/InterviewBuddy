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
public class CodingProblemDetailResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String constraintsText;
    private String difficulty;
    private String topic;
    private String platform;
    private String externalUrl;
    private Long sheetId;
    private String sheetName;
    private List<Long> sheetIds;
    private Long patternId;
    private String patternName;
    private String status;
    private List<ExampleDto> examples;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ExampleDto {
        private String inputText;
        private String outputText;
        private String explanation;
    }
}
