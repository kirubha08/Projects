package com.ems.service;

import com.ems.dto.request.DepartmentRequest;
import com.ems.dto.response.DepartmentResponse;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.ApiException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return toResponse(department);
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new ApiException("Department name already exists: " + request.getName(), HttpStatus.BAD_REQUEST);
        }

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getManagerId()));
            department.setManager(manager);
        }

        department = departmentRepository.save(department);
        log.info("Department created: {}", department.getId());
        return toResponse(department);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        department.setName(request.getName());
        if (request.getDescription() != null) department.setDescription(request.getDescription());
        if (request.getManagerId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getManagerId()));
            department.setManager(manager);
        }

        department = departmentRepository.save(department);
        log.info("Department updated: {}", department.getId());
        return toResponse(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department", "id", id);
        }
        departmentRepository.deleteById(id);
        log.info("Department deleted: {}", id);
    }

    private DepartmentResponse toResponse(Department department) {
        DepartmentResponse response = new DepartmentResponse();
        response.setId(department.getId());
        response.setName(department.getName());
        response.setDescription(department.getDescription());
        response.setCreatedAt(department.getCreatedAt());
        if (department.getManager() != null) {
            response.setManagerId(department.getManager().getId());
            response.setManagerName(department.getManager().getFirstName() + " " + department.getManager().getLastName());
        }
        return response;
    }
}
