package com.ems.dto.response;

import com.ems.entity.Leave;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long leaveTypeId;
    private String leaveTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalDays;
    private String reason;
    private Leave.LeaveStatus status;
    private Long approvedById;
    private String approvedByName;
}
