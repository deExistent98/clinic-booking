package com.clinicbooking.clinicbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinicbooking.clinicbackend.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
}
