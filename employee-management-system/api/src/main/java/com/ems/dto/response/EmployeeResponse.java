package com.ems.dto.response;

import com.ems.entity.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private Long id;
    private String empCode;
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dob;
    private Employee.Gender gender;
    private String phone;
    private String address;
    private String photoUrl;
    private LocalDate hireDate;
    private Employee.Status status;
    private Long userId;
    private String username;
    private String email;
}
