package com.ems.dto.request;

import com.ems.entity.Employee;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmployeeRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String empCode;
    private LocalDate dob;
    private Employee.Gender gender;
    private String phone;
    private String address;
    private String photoUrl;
    private LocalDate hireDate;
    private Employee.Status status;
    private Long userId;
}
