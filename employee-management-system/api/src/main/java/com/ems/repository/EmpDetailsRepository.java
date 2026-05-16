package com.ems.repository;

import com.ems.entity.EmpDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpDetailsRepository extends JpaRepository<EmpDetails, Long> {

    Optional<EmpDetails> findByEmployeeId(Long employeeId);
}
