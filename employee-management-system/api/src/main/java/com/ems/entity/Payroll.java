package com.ems.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "basic_salary", precision = 15)
    private BigDecimal basicSalary;

    @Column(precision = 15)
    private BigDecimal allowances;

    @Column(precision = 15)
    private BigDecimal deductions;

    @Column(name = "net_salary", precision = 15)
    private BigDecimal netSalary;

    private String status;

    @Column(name = "paid_date")
    private LocalDate paidDate;
}
