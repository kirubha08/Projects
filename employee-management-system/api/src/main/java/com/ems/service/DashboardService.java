package com.ems.service;

import com.ems.dto.response.DashboardStatsResponse;
import com.ems.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final LeaveRepository leaveRepository;
    private final AttendanceRepository attendanceRepository;
    private final PayrollRepository payrollRepository;

    public DashboardStatsResponse getStats() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countActiveEmployees();
        long totalDepartments = departmentRepository.count();
        long pendingLeaves = leaveRepository.countPendingLeaves();
        long presentToday = attendanceRepository.countPresentOnDate(LocalDate.now());

        LocalDate now = LocalDate.now();
        long totalPayrollThisMonth = payrollRepository.findByMonthAndYear(now.getMonthValue(), now.getYear()).size();

        return DashboardStatsResponse.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .totalDepartments(totalDepartments)
                .pendingLeaves(pendingLeaves)
                .presentToday(presentToday)
                .totalPayrollThisMonth(totalPayrollThisMonth)
                .build();
    }
}
