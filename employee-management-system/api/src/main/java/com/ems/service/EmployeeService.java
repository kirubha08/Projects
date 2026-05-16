package com.ems.service;

import com.ems.dto.request.EmployeeRequest;
import com.ems.dto.response.EmployeeResponse;
import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.exception.ApiException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Page<EmployeeResponse> getAllEmployeesPaged(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::toResponse);
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (request.getEmpCode() != null && employeeRepository.existsByEmpCode(request.getEmpCode())) {
            throw new ApiException("Employee code already exists: " + request.getEmpCode(), HttpStatus.BAD_REQUEST);
        }

        Employee employee = Employee.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .empCode(request.getEmpCode())
                .dob(request.getDob())
                .gender(request.getGender())
                .phone(request.getPhone())
                .address(request.getAddress())
                .photoUrl(request.getPhotoUrl())
                .hireDate(request.getHireDate())
                .status(request.getStatus() != null ? request.getStatus() : Employee.Status.ACTIVE)
                .build();

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));
            employee.setUser(user);
        }

        employee = employeeRepository.save(employee);
        log.info("Employee created: {}", employee.getId());
        return toResponse(employee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        if (request.getEmpCode() != null) employee.setEmpCode(request.getEmpCode());
        if (request.getDob() != null) employee.setDob(request.getDob());
        if (request.getGender() != null) employee.setGender(request.getGender());
        if (request.getPhone() != null) employee.setPhone(request.getPhone());
        if (request.getAddress() != null) employee.setAddress(request.getAddress());
        if (request.getPhotoUrl() != null) employee.setPhotoUrl(request.getPhotoUrl());
        if (request.getHireDate() != null) employee.setHireDate(request.getHireDate());
        if (request.getStatus() != null) employee.setStatus(request.getStatus());

        employee = employeeRepository.save(employee);
        log.info("Employee updated: {}", employee.getId());
        return toResponse(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee", "id", id);
        }
        employeeRepository.deleteById(id);
        log.info("Employee deleted: {}", id);
    }

    public EmployeeResponse toResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmpCode(employee.getEmpCode());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setFullName(employee.getFirstName() + " " + employee.getLastName());
        response.setDob(employee.getDob());
        response.setGender(employee.getGender());
        response.setPhone(employee.getPhone());
        response.setAddress(employee.getAddress());
        response.setPhotoUrl(employee.getPhotoUrl());
        response.setHireDate(employee.getHireDate());
        response.setStatus(employee.getStatus());
        if (employee.getUser() != null) {
            response.setUserId(employee.getUser().getId());
            response.setUsername(employee.getUser().getUsername());
            response.setEmail(employee.getUser().getEmail());
        }
        return response;
    }
}
