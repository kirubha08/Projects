package com.ems.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private long pendingLeaves;
    private long presentToday;
    private long totalPayrollThisMonth;
}
