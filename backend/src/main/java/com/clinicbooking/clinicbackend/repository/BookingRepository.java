package com.clinicbooking.clinicbackend.repository;

import com.clinicbooking.clinicbackend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // 🔹 Trova tutte le prenotazioni di un utente
    List<Booking> findByUserId(Long userId);

    // 🔹 Controlla se un medico è già prenotato in una certa data e fascia oraria
    boolean existsByDoctorIdAndDateAndTimeSlot(Long doctorId, LocalDate date, String timeSlot);
}
