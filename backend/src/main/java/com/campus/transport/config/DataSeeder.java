package com.campus.transport.config;

import com.campus.transport.entity.Driver;
import com.campus.transport.entity.User;
import com.campus.transport.entity.Vehicle;
import com.campus.transport.enums.AvailabilityStatus;
import com.campus.transport.enums.Role;
import com.campus.transport.enums.ServiceType;
import com.campus.transport.enums.VehicleStatus;
import com.campus.transport.repository.DriverRepository;
import com.campus.transport.repository.UserRepository;
import com.campus.transport.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@campus.edu";
    private static final String ADMIN_PASSWORD = "Admin@123";
    private static final String DRIVER_DEFAULT_PASSWORD = "Driver@123";

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        seedDrivers();
        seedVehicles();
    }

    // ── Admin user ─────────────────────────────────────────────
    private void seedAdmin() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            log.info("Admin already exists: {}", ADMIN_EMAIL);
            return;
        }

        User admin = User.builder()
                .name("Dr. S. Mehta")
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .phone("+91-9800000001")
                .build();

        userRepository.save(admin);
        log.info("Seeded admin: {} / {}", ADMIN_EMAIL, ADMIN_PASSWORD);
    }

    // ── Sample drivers ─────────────────────────────────────────
    private void seedDrivers() {
        String[][] drivers = {
                {"Suresh Kumar", "suresh@campus.edu", "+91-9811111111"},
                {"Ravi Sharma", "ravi@campus.edu", "+91-9822222222"},
                {"Mohan Lal", "mohan@campus.edu", "+91-9833333333"}
        };

        int createdCount = 0;

        for (String[] d : drivers) {
            String name = d[0];
            String email = d[1];
            String phone = d[2];

            // Skip if user or driver already exists
            boolean userExists = userRepository.existsByEmail(email);
            boolean driverExists = driverRepository.findByEmail(email).isPresent();

            if (userExists || driverExists) {
                log.info("Driver already exists, skipping: {}", email);
                continue;
            }

            User user = User.builder()
                    .name(name)
                    .email(email)
                    .password(passwordEncoder.encode(DRIVER_DEFAULT_PASSWORD))
                    .role(Role.DRIVER)
                    .phone(phone)
                    .build();
            userRepository.save(user);

            Driver driver = Driver.builder()
                    .name(name)
                    .email(email)
                    .phone(phone)
                    .availability(AvailabilityStatus.OFF_DUTY)
                    .user(user)
                    .totalTrips(0)
                    .build();
            driverRepository.save(driver);

            createdCount++;
        }

        log.info("Seeded {} sample driver(s) (password: {})", createdCount, DRIVER_DEFAULT_PASSWORD);
    }

    // ── Sample vehicles ────────────────────────────────────────
    private void seedVehicles() {
        Object[][] vehicles = {
                {ServiceType.AMBULANCE, "UP32 AA 0001", "2 patients"},
                {ServiceType.ERICKSHAW, "UP32 AB 1234", "4 persons"},
                {ServiceType.ERICKSHAW, "UP32 AB 5678", "4 persons"},
                {ServiceType.INDENTA, "UP32 AC 9101", "50 seats"}
        };

        int createdCount = 0;

        for (Object[] v : vehicles) {
            String registrationNo = (String) v[1];

            boolean exists = vehicleRepository.findAll().stream()
                    .anyMatch(vehicle -> vehicle.getRegistrationNo().equalsIgnoreCase(registrationNo));

            if (exists) {
                log.info("Vehicle already exists, skipping: {}", registrationNo);
                continue;
            }

            Vehicle vehicle = Vehicle.builder()
                    .vehicleType((ServiceType) v[0])
                    .registrationNo(registrationNo)
                    .capacity((String) v[2])
                    .status(VehicleStatus.AVAILABLE)
                    .build();

            vehicleRepository.save(vehicle);
            createdCount++;
        }

        log.info("Seeded {} sample vehicle(s)", createdCount);
    }
}
