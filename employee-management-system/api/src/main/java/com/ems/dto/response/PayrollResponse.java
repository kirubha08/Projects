package com.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String empCode;
    private Integer month;
    private Integer year;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private String status;
    private LocalDate paidDate;
}
