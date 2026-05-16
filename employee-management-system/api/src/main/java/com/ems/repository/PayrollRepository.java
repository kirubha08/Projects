package com.ems.repository;

import com.ems.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    List<Payroll> findByEmployeeId(Long employeeId);

    Optional<Payroll> findByEmployeeIdAndMonthAndYear(Long employeeId, Integer month, Integer year);

    @Query("SELECT p FROM Payroll p WHERE p.month = :month AND p.year = :year")
    List<Payroll> findByMonthAndYear(@Param("month") Integer month, @Param("year") Integer year);

    List<Payroll> findByEmployeeIdAndYear(Long employeeId, Integer year);
}
