package com.ems.dto.request;

import com.ems.entity.Attendance;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AttendanceRequest {

    private Long employeeId;
    private LocalDate date;
    private LocalTime checkIn;
    private LocalTime checkOut;
    private Attendance.AttendanceStatus status;
    private String remarks;
}
