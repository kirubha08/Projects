package com.ems.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PerformanceRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private Long reviewerId;
    private String period;
    private Double score;
    private String comments;
    private String goals;
}
