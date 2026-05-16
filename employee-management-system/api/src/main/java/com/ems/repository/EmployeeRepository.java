package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmpCode(String empCode);

    Optional<Employee> findByUserId(Long userId);

    boolean existsByEmpCode(String empCode);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE'")
    long countActiveEmployees();
}
