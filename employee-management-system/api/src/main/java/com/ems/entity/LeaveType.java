package com.ems.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leave_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "max_days_per_year")
    private Integer maxDaysPerYear;

    @Column(name = "carry_forward")
    @Builder.Default
    private Boolean carryForward = false;

    private String description;
}
