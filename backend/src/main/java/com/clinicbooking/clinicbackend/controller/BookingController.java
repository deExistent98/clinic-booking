package com.clinicbooking.clinicbackend.controller;

import com.clinicbooking.clinicbackend.model.Booking;
import com.clinicbooking.clinicbackend.model.Doctor;
import com.clinicbooking.clinicbackend.model.User;
import com.clinicbooking.clinicbackend.repository.BookingRepository;
import com.clinicbooking.clinicbackend.repository.DoctorRepository;
import com.clinicbooking.clinicbackend.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")

@Tag(name = "Prenotazioni", description = "Gestione delle prenotazioni mediche (creazione, aggiornamento, cancellazione)")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Operation(summary = "Recupera tutte le prenotazioni")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Operation(summary = "Recupera una prenotazione tramite ID")
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Recupera tutte le prenotazioni di un utente specifico")
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Operation(summary = "Crea una nuova prenotazione (con controllo disponibilità medico)")
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        Optional<User> user = userRepository.findById(booking.getUser().getId());
        Optional<Doctor> doctor = doctorRepository.findById(booking.getDoctor().getId());

        if (user.isEmpty() || doctor.isEmpty()) {
            return ResponseEntity.badRequest().body("Utente o medico non trovato.");
        }

        boolean alreadyBooked = bookingRepository.existsByDoctorIdAndDateAndTimeSlot(
                booking.getDoctor().getId(),
                booking.getDate(),
                booking.getTimeSlot()
        );

        if (alreadyBooked) {
            return ResponseEntity.badRequest().body("❌ Il medico ha già una prenotazione per questa data e ora.");
        }

        booking.setUser(user.get());
        booking.setDoctor(doctor.get());
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }

    @Operation(summary = "Aggiorna una prenotazione esistente (data, orario, stato, note)")
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setDate(updatedBooking.getDate());
                    booking.setTimeSlot(updatedBooking.getTimeSlot());
                    booking.setStatus(updatedBooking.getStatus());
                    booking.setNotes(updatedBooking.getNotes());
                    bookingRepository.save(booking);
                    return ResponseEntity.ok(booking);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Aggiorna solo lo stato della prenotazione")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody String newStatus) {
        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(newStatus.replace("\"", "")); // Rimuove eventuali doppi apici
                    bookingRepository.save(booking);
                    return ResponseEntity.ok(booking);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Elimina una prenotazione tramite ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
