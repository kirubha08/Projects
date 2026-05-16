package com.ems.service;

import com.ems.dto.request.PayrollRequest;
import com.ems.dto.response.PayrollResponse;
import com.ems.entity.Employee;
import com.ems.entity.Payroll;
import com.ems.exception.ApiException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollResponse getPayrollByEmployeeMonthYear(Long employeeId, Integer month, Integer year) {
        Payroll payroll = payrollRepository.findByEmployeeIdAndMonthAndYear(employeeId, month, year)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Payroll not found for employee %d, month %d, year %d", employeeId, month, year)));
        return toResponse(payroll);
    }

    public List<PayrollResponse> getPayrollByEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PayrollResponse> getPayrollByMonthYear(Integer month, Integer year) {
        return payrollRepository.findByMonthAndYear(month, year).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PayrollResponse generatePayroll(PayrollRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.getEmployeeId()));

        payrollRepository.findByEmployeeIdAndMonthAndYear(request.getEmployeeId(), request.getMonth(), request.getYear())
                .ifPresent(p -> {
                    throw new ApiException(
                            String.format("Payroll already generated for employee %d, month %d, year %d",
                                    request.getEmployeeId(), request.getMonth(), request.getYear()),
                            HttpStatus.BAD_REQUEST);
                });

        BigDecimal basicSalary = request.getBasicSalary() != null ? request.getBasicSalary() : BigDecimal.ZERO;
        BigDecimal allowances = request.getAllowances() != null ? request.getAllowances() : BigDecimal.ZERO;
        BigDecimal deductions = request.getDeductions() != null ? request.getDeductions() : BigDecimal.ZERO;
        BigDecimal netSalary = basicSalary.add(allowances).subtract(deductions);

        Payroll payroll = Payroll.builder()
                .employee(employee)
                .month(request.getMonth())
                .year(request.getYear())
                .basicSalary(basicSalary)
                .allowances(allowances)
                .deductions(deductions)
                .netSalary(netSalary)
                .status("GENERATED")
                .build();

        payroll = payrollRepository.save(payroll);
        log.info("Payroll generated for employee: {}, month: {}, year: {}", request.getEmployeeId(), request.getMonth(), request.getYear());
        return toResponse(payroll);
    }

    private PayrollResponse toResponse(Payroll payroll) {
        PayrollResponse response = new PayrollResponse();
        response.setId(payroll.getId());
        response.setMonth(payroll.getMonth());
        response.setYear(payroll.getYear());
        response.setBasicSalary(payroll.getBasicSalary());
        response.setAllowances(payroll.getAllowances());
        response.setDeductions(payroll.getDeductions());
        response.setNetSalary(payroll.getNetSalary());
        response.setStatus(payroll.getStatus());
        response.setPaidDate(payroll.getPaidDate());
        if (payroll.getEmployee() != null) {
            response.setEmployeeId(payroll.getEmployee().getId());
            response.setEmployeeName(payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName());
            response.setEmpCode(payroll.getEmployee().getEmpCode());
        }
        return response;
    }
}
