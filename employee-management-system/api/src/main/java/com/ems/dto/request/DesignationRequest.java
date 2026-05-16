package com.ems.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DesignationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private Long departmentId;
    private Integer level;
    private String description;
}
