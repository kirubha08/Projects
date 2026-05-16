package com.ems.controller;

import com.ems.dto.request.AttendanceRequest;
import com.ems.dto.response.AttendanceResponse;
import com.ems.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Attendance", description = "Attendance management endpoints")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    @Operation(summary = "Get all attendance records")
    public ResponseEntity<List<AttendanceResponse>> getAllAttendance(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<AttendanceResponse> responses;
        if (employeeId != null) {
            responses = attendanceService.getAttendanceByEmployee(employeeId);
        } else if (startDate != null && endDate != null) {
            responses = attendanceService.getAttendanceByDateRange(startDate, endDate);
        } else {
            responses = attendanceService.getAllAttendance();
        }
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @Operation(summary = "Create attendance record")
    public ResponseEntity<AttendanceResponse> createAttendance(@RequestBody AttendanceRequest request) {
        AttendanceResponse response = attendanceService.createAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/checkin")
    @Operation(summary = "Check in employee")
    public ResponseEntity<AttendanceResponse> checkIn(@RequestParam Long employeeId) {
        AttendanceResponse response = attendanceService.checkIn(employeeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/checkout")
    @Operation(summary = "Check out employee")
    public ResponseEntity<AttendanceResponse> checkOut(@RequestParam Long employeeId) {
        AttendanceResponse response = attendanceService.checkOut(employeeId);
        return ResponseEntity.ok(response);
    }
}
