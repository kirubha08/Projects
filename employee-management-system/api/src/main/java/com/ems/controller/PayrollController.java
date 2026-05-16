package com.ems.controller;

import com.ems.dto.request.PayrollRequest;
import com.ems.dto.response.PayrollResponse;
import com.ems.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payroll", description = "Payroll management endpoints")
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/{employeeId}/{month}")
    @Operation(summary = "Get payroll for employee by month")
    public ResponseEntity<List<PayrollResponse>> getPayrollByEmployee(
            @PathVariable Long employeeId,
            @PathVariable Integer month,
            @RequestParam(required = false) Integer year) {
        if (year != null) {
            PayrollResponse response = payrollService.getPayrollByEmployeeMonthYear(employeeId, month, year);
            return ResponseEntity.ok(List.of(response));
        }
        return ResponseEntity.ok(payrollService.getPayrollByEmployee(employeeId));
    }

    @GetMapping
    @Operation(summary = "Get all payrolls or filter by month/year")
    public ResponseEntity<List<PayrollResponse>> getPayrolls(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        if (month != null && year != null) {
            return ResponseEntity.ok(payrollService.getPayrollByMonthYear(month, year));
        }
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate payroll for an employee")
    public ResponseEntity<PayrollResponse> generatePayroll(@Valid @RequestBody PayrollRequest request) {
        PayrollResponse response = payrollService.generatePayroll(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
