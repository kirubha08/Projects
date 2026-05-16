package com.ems.dto.response;

import com.ems.entity.Attendance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String empCode;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private Attendance.AttendanceStatus status;
    private String remarks;
}
