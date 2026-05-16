package com.ems.service;

import com.ems.dto.request.LeaveRequest;
import com.ems.dto.request.LeaveTypeRequest;
import com.ems.dto.response.LeaveResponse;
import com.ems.dto.response.LeaveTypeResponse;
import com.ems.entity.Employee;
import com.ems.entity.Leave;
import com.ems.entity.LeaveType;
import com.ems.entity.User;
import com.ems.exception.ApiException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import com.ems.repository.LeaveTypeRepository;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public List<LeaveResponse> getAllLeaves() {
        return leaveRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveResponse> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse createLeave(LeaveRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        LeaveType leaveType = leaveTypeRepository.findById(request.getLeaveTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("LeaveType", "id", request.getLeaveTypeId()));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ApiException("End date cannot be before start date", HttpStatus.BAD_REQUEST);
        }

        Leave leave = Leave.builder()
                .employee(employee)
                .leaveType(leaveType)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .status(Leave.LeaveStatus.PENDING)
                .build();

        leave = leaveRepository.save(leave);
        log.info("Leave request created for employee: {}", request.getEmployeeId());
        return toResponse(leave);
    }

    @Transactional
    public LeaveResponse approveLeave(Long leaveId, Long approvedByUserId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));

        if (leave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new ApiException("Leave is not in PENDING status", HttpStatus.BAD_REQUEST);
        }

        User approver = userRepository.findById(approvedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", approvedByUserId));

        leave.setStatus(Leave.LeaveStatus.APPROVED);
        leave.setApprovedBy(approver);
        leave = leaveRepository.save(leave);
        log.info("Leave {} approved by user {}", leaveId, approvedByUserId);
        return toResponse(leave);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long leaveId, Long rejectedByUserId) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave", "id", leaveId));

        if (leave.getStatus() != Leave.LeaveStatus.PENDING) {
            throw new ApiException("Leave is not in PENDING status", HttpStatus.BAD_REQUEST);
        }

        User rejector = userRepository.findById(rejectedByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", rejectedByUserId));

        leave.setStatus(Leave.LeaveStatus.REJECTED);
        leave.setApprovedBy(rejector);
        leave = leaveRepository.save(leave);
        log.info("Leave {} rejected by user {}", leaveId, rejectedByUserId);
        return toResponse(leave);
    }

    public List<LeaveTypeResponse> getAllLeaveTypes() {
        return leaveTypeRepository.findAll().stream()
                .map(this::toLeaveTypeResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveTypeResponse createLeaveType(LeaveTypeRequest request) {
        if (leaveTypeRepository.existsByName(request.getName())) {
            throw new ApiException("Leave type already exists: " + request.getName(), HttpStatus.BAD_REQUEST);
        }

        LeaveType leaveType = LeaveType.builder()
                .name(request.getName())
                .maxDaysPerYear(request.getMaxDaysPerYear())
                .carryForward(request.getCarryForward() != null ? request.getCarryForward() : false)
                .description(request.getDescription())
                .build();

        leaveType = leaveTypeRepository.save(leaveType);
        log.info("Leave type created: {}", leaveType.getName());
        return toLeaveTypeResponse(leaveType);
    }

    private LeaveResponse toResponse(Leave leave) {
        LeaveResponse response = new LeaveResponse();
        response.setId(leave.getId());
        response.setStartDate(leave.getStartDate());
        response.setEndDate(leave.getEndDate());
        response.setReason(leave.getReason());
        response.setStatus(leave.getStatus());

        if (leave.getStartDate() != null && leave.getEndDate() != null) {
            response.setTotalDays(ChronoUnit.DAYS.between(leave.getStartDate(), leave.getEndDate()) + 1);
        }

        if (leave.getEmployee() != null) {
            response.setEmployeeId(leave.getEmployee().getId());
            response.setEmployeeName(leave.getEmployee().getFirstName() + " " + leave.getEmployee().getLastName());
        }

        if (leave.getLeaveType() != null) {
            response.setLeaveTypeId(leave.getLeaveType().getId());
            response.setLeaveTypeName(leave.getLeaveType().getName());
        }

        if (leave.getApprovedBy() != null) {
            response.setApprovedById(leave.getApprovedBy().getId());
            response.setApprovedByName(leave.getApprovedBy().getUsername());
        }

        return response;
    }

    private LeaveTypeResponse toLeaveTypeResponse(LeaveType leaveType) {
        return LeaveTypeResponse.builder()
                .id(leaveType.getId())
                .name(leaveType.getName())
                .maxDaysPerYear(leaveType.getMaxDaysPerYear())
                .carryForward(leaveType.getCarryForward())
                .description(leaveType.getDescription())
                .build();
    }
}
