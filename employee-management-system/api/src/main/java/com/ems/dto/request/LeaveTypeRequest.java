package com.ems.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LeaveTypeRequest {

    @NotBlank(message = "Leave type name is required")
    private String name;

    private Integer maxDaysPerYear;
    private Boolean carryForward;
    private String description;
}
