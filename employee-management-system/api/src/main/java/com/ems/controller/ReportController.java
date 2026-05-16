package com.ems.controller;

import com.ems.dto.response.AttendanceResponse;
import com.ems.dto.response.PayrollResponse;
import com.ems.service.AttendanceService;
import com.ems.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reports", description = "Reporting endpoints")
public class ReportController {

    private final AttendanceService attendanceService;
    private final PayrollService payrollService;

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance report by date range")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long employeeId) {

        List<AttendanceResponse> responses;
        if (employeeId != null) {
            responses = attendanceService.getAttendanceByEmployee(employeeId).stream()
                    .filter(a -> !a.getDate().isBefore(startDate) && !a.getDate().isAfter(endDate))
                    .toList();
        } else {
            responses = attendanceService.getAttendanceByDateRange(startDate, endDate);
        }
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/payroll")
    @Operation(summary = "Get payroll report by month and year")
    public ResponseEntity<List<PayrollResponse>> getPayrollReport(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        List<PayrollResponse> responses = payrollService.getPayrollByMonthYear(month, year);
        return ResponseEntity.ok(responses);
    }
}
