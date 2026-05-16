package com.ems.repository;

import com.ems.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {

    List<Designation> findByDepartmentId(Long departmentId);
}
