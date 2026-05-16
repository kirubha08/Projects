package com.ems.controller;

import com.ems.dto.request.PerformanceRequest;
import com.ems.dto.response.PerformanceResponse;
import com.ems.service.PerformanceService;
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
@RequestMapping("/api/performance")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Performance", description = "Performance review endpoints")
public class PerformanceController {

    private final PerformanceService performanceService;

    @GetMapping
    @Operation(summary = "Get all performance reviews")
    public ResponseEntity<List<PerformanceResponse>> getAllPerformances(
            @RequestParam(required = false) Long employeeId) {
        List<PerformanceResponse> responses;
        if (employeeId != null) {
            responses = performanceService.getPerformanceByEmployee(employeeId);
        } else {
            responses = performanceService.getAllPerformances();
        }
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @Operation(summary = "Create a performance review")
    public ResponseEntity<PerformanceResponse> createPerformance(@Valid @RequestBody PerformanceRequest request) {
        PerformanceResponse response = performanceService.createPerformance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
