package com.ems.service;

import com.ems.dto.request.PerformanceRequest;
import com.ems.dto.response.PerformanceResponse;
import com.ems.entity.Employee;
import com.ems.entity.Performance;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PerformanceService {

    private final PerformanceRepository performanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<PerformanceResponse> getAllPerformances() {
        return performanceRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PerformanceResponse> getPerformanceByEmployee(Long employeeId) {
        return performanceRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PerformanceResponse createPerformance(PerformanceRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        Performance performance = Performance.builder()
                .employee(employee)
                .period(request.getPeriod())
                .score(request.getScore())
                .comments(request.getComments())
                .goals(request.getGoals())
                .build();

        if (request.getReviewerId() != null) {
            Employee reviewer = employeeRepository.findById(request.getReviewerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee (reviewer)", "id", request.getReviewerId()));
            performance.setReviewer(reviewer);
        }

        performance = performanceRepository.save(performance);
        log.info("Performance review created for employee: {}", request.getEmployeeId());
        return toResponse(performance);
    }

    private PerformanceResponse toResponse(Performance performance) {
        PerformanceResponse response = new PerformanceResponse();
        response.setId(performance.getId());
        response.setPeriod(performance.getPeriod());
        response.setScore(performance.getScore());
        response.setComments(performance.getComments());
        response.setGoals(performance.getGoals());
        response.setCreatedAt(performance.getCreatedAt());
        if (performance.getEmployee() != null) {
            response.setEmployeeId(performance.getEmployee().getId());
            response.setEmployeeName(performance.getEmployee().getFirstName() + " " + performance.getEmployee().getLastName());
        }
        if (performance.getReviewer() != null) {
            response.setReviewerId(performance.getReviewer().getId());
            response.setReviewerName(performance.getReviewer().getFirstName() + " " + performance.getReviewer().getLastName());
        }
        return response;
    }
}
