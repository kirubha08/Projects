package com.ems.service;

import com.ems.dto.request.AttendanceRequest;
import com.ems.dto.response.AttendanceResponse;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.exception.ApiException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<AttendanceResponse> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findAllByDateBetween(startDate, endDate).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));

        LocalDate today = LocalDate.now();
        if (attendanceRepository.findByEmployeeIdAndDate(employeeId, today).isPresent()) {
            throw new ApiException("Already checked in for today", HttpStatus.BAD_REQUEST);
        }

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkIn(LocalTime.now())
                .status(Attendance.AttendanceStatus.PRESENT)
                .build();

        attendance = attendanceRepository.save(attendance);
        log.info("Employee {} checked in at {}", employeeId, attendance.getCheckIn());
        return toResponse(attendance);
    }

    @Transactional
    public AttendanceResponse checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new ApiException("No check-in found for today", HttpStatus.BAD_REQUEST));

        if (attendance.getCheckOut() != null) {
            throw new ApiException("Already checked out for today", HttpStatus.BAD_REQUEST);
        }

        attendance.setCheckOut(LocalTime.now());
        attendance = attendanceRepository.save(attendance);
        log.info("Employee {} checked out at {}", employeeId, attendance.getCheckOut());
        return toResponse(attendance);
    }

    @Transactional
    public AttendanceResponse createAttendance(AttendanceRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .status(request.getStatus() != null ? request.getStatus() : Attendance.AttendanceStatus.PRESENT)
                .remarks(request.getRemarks())
                .build();

        attendance = attendanceRepository.save(attendance);
        return toResponse(attendance);
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setDate(attendance.getDate());
        response.setCheckIn(attendance.getCheckIn());
        response.setCheckOut(attendance.getCheckOut());
        response.setStatus(attendance.getStatus());
        response.setRemarks(attendance.getRemarks());
        if (attendance.getEmployee() != null) {
            response.setEmployeeId(attendance.getEmployee().getId());
            response.setEmployeeName(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName());
            response.setEmpCode(attendance.getEmployee().getEmpCode());
        }
        return response;
    }
}
