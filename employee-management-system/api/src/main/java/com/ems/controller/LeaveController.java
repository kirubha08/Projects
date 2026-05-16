package com.ems.controller;

import com.ems.dto.request.LeaveRequest;
import com.ems.dto.request.LeaveTypeRequest;
import com.ems.dto.response.LeaveResponse;
import com.ems.dto.response.LeaveTypeResponse;
import com.ems.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.ems.entity.User;
import com.ems.repository.UserRepository;

@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Leaves", description = "Leave management endpoints")
public class LeaveController {

    private final LeaveService leaveService;
    private final UserRepository userRepository;

    @GetMapping("/api/leaves")
    @Operation(summary = "Get all leave requests")
    public ResponseEntity<List<LeaveResponse>> getAllLeaves(
            @RequestParam(required = false) Long employeeId) {
        List<LeaveResponse> responses;
        if (employeeId != null) {
            responses = leaveService.getLeavesByEmployee(employeeId);
        } else {
            responses = leaveService.getAllLeaves();
        }
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/api/leaves")
    @Operation(summary = "Create a leave request")
    public ResponseEntity<LeaveResponse> createLeave(@Valid @RequestBody LeaveRequest request) {
        LeaveResponse response = leaveService.createLeave(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/leaves/{id}/approve")
    @Operation(summary = "Approve a leave request")
    public ResponseEntity<LeaveResponse> approveLeave(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserId(authentication);
        LeaveResponse response = leaveService.approveLeave(id, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/leaves/{id}/reject")
    @Operation(summary = "Reject a leave request")
    public ResponseEntity<LeaveResponse> rejectLeave(@PathVariable Long id, Authentication authentication) {
        Long userId = getUserId(authentication);
        LeaveResponse response = leaveService.rejectLeave(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/leave-types")
    @Operation(summary = "Get all leave types")
    public ResponseEntity<List<LeaveTypeResponse>> getAllLeaveTypes() {
        return ResponseEntity.ok(leaveService.getAllLeaveTypes());
    }

    @PostMapping("/api/leave-types")
    @Operation(summary = "Create a new leave type")
    public ResponseEntity<LeaveTypeResponse> createLeaveType(@Valid @RequestBody LeaveTypeRequest request) {
        LeaveTypeResponse response = leaveService.createLeaveType(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private Long getUserId(Authentication authentication) {
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByUsername(username)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
