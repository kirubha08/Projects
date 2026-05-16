package com.ems.repository;

import com.ems.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeId(Long employeeId);

    List<Leave> findByStatus(Leave.LeaveStatus status);

    @Query("SELECT COUNT(l) FROM Leave l WHERE l.status = 'PENDING'")
    long countPendingLeaves();

    @Query("SELECT l FROM Leave l WHERE l.employee.id = :employeeId AND l.status = :status")
    List<Leave> findByEmployeeIdAndStatus(@Param("employeeId") Long employeeId,
                                          @Param("status") Leave.LeaveStatus status);
}
