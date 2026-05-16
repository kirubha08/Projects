package com.ems.controller;

import com.ems.dto.request.DesignationRequest;
import com.ems.dto.response.DesignationResponse;
import com.ems.entity.Designation;
import com.ems.entity.Department;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DesignationRepository;
import com.ems.repository.DepartmentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Designations", description = "Designation management endpoints")
public class DesignationController {

    private final DesignationRepository designationRepository;
    private final DepartmentRepository departmentRepository;

    @GetMapping
    @Operation(summary = "Get all designations")
    public ResponseEntity<List<DesignationResponse>> getAllDesignations() {
        List<DesignationResponse> responses = designationRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @Operation(summary = "Create a new designation")
    public ResponseEntity<DesignationResponse> createDesignation(@Valid @RequestBody DesignationRequest request) {
        Designation designation = new Designation();
        designation.setTitle(request.getTitle());
        designation.setLevel(request.getLevel());
        designation.setDescription(request.getDescription());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            designation.setDepartment(department);
        }

        designation = designationRepository.save(designation);
        log.info("Designation created: {}", designation.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(designation));
    }

    private DesignationResponse toResponse(Designation designation) {
        DesignationResponse response = new DesignationResponse();
        response.setId(designation.getId());
        response.setTitle(designation.getTitle());
        response.setLevel(designation.getLevel());
        response.setDescription(designation.getDescription());
        if (designation.getDepartment() != null) {
            response.setDepartmentId(designation.getDepartment().getId());
            response.setDepartmentName(designation.getDepartment().getName());
        }
        return response;
    }
}
