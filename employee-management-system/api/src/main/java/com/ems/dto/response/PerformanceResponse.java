package com.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long reviewerId;
    private String reviewerName;
    private String period;
    private Double score;
    private String comments;
    private String goals;
    private LocalDateTime createdAt;
}
