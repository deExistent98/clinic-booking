package com.clinicbooking.clinicbackend.config;

import com.clinicbooking.clinicbackend.model.*;
import com.clinicbooking.clinicbackend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepo, DoctorRepository doctorRepo, BookingRepository bookingRepo) {
        return args -> {

            // 🔹 CREA UTENTI SOLO SE NON ESISTONO
            if (userRepo.count() == 0) {
                User u1 = new User(
                        null, // id
                        "Stefano Cacucci",
                        "scacucci15@gmail.com",
                        "1234",
                        "3277916300",
                        "PATIENT",
                        null // bookings
                );

                User u2 = new User(
                        null,
                        "Maria Bianchi",
                        "maria.bianchi@example.com",
                        "abcd",
                        "3399988776",
                        "PATIENT",
                        null
                );

                userRepo.saveAll(List.of(u1, u2));
                System.out.println("✅ Utenti di test caricati");
            }

            // 🔹 CREA MEDICI SOLO SE NON ESISTONO
            if (doctorRepo.count() == 0) {
                Doctor d1 = new Doctor(null, "Mario", "Rossi", "Cardiologia", "Lun-Ven 9:00-17:00");
                Doctor d2 = new Doctor(null, "Laura", "Verdi", "Dermatologia", "Mar-Gio 10:00-18:00");
                doctorRepo.saveAll(List.of(d1, d2));
                System.out.println("✅ Medici di test caricati");
            }

            // 🔹 CREA PRENOTAZIONI SOLO SE NON ESISTONO
            if (bookingRepo.count() == 0) {
                User user1 = userRepo.findAll().get(0);
                User user2 = userRepo.findAll().get(1);
                Doctor doc1 = doctorRepo.findAll().get(0);
                Doctor doc2 = doctorRepo.findAll().get(1);

                Booking b1 = new Booking(
                        null, // id
                        user1,
                        doc1,
                        LocalDate.now().plusDays(1),
                        "10:00",
                        "In attesa",
                        "Prima visita"
                );

                Booking b2 = new Booking(
                        null,
                        user2,
                        doc2,
                        LocalDate.now().plusDays(2),
                        "11:30",
                        "Completata",
                        "Controllo annuale"
                );

                bookingRepo.saveAll(List.of(b1, b2));
                System.out.println("✅ Prenotazioni di test caricate");
            }

            System.out.println("🚀 Database inizializzato correttamente!");
        };
    }
}
