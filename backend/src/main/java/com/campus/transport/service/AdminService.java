package com.campus.transport.service;

import com.campus.transport.dto.AnalyticsDTO;
import com.campus.transport.dto.DriverDTO;
import com.campus.transport.dto.VehicleDTO;
import com.campus.transport.entity.Driver;
import com.campus.transport.entity.TransportRequest;
import com.campus.transport.entity.User;
import com.campus.transport.entity.Vehicle;
import com.campus.transport.enums.*;
import com.campus.transport.exception.BadRequestException;
import com.campus.transport.exception.ResourceNotFoundException;
import com.campus.transport.repository.DriverRepository;
import com.campus.transport.repository.TransportRequestRepository;
import com.campus.transport.repository.UserRepository;
import com.campus.transport.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final TransportRequestRepository requestRepository;
    private final PasswordEncoder passwordEncoder;

    // ══ VEHICLE MANAGEMENT ══════════════════════════════════════

    @Transactional(readOnly = true)
    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public VehicleDTO addVehicle(VehicleDTO dto) {
        Vehicle vehicle = Vehicle.builder()
                .vehicleType(dto.getVehicleType())
                .registrationNo(dto.getRegistrationNo())
                .capacity(dto.getCapacity())
                .driverName(dto.getDriverName())
                .status(dto.getStatus() != null ? dto.getStatus() : VehicleStatus.AVAILABLE)
                .build();

        return VehicleDTO.from(vehicleRepository.save(vehicle));
    }

    @Transactional
    public VehicleDTO updateVehicle(Long id, VehicleDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));

        if (dto.getVehicleType() != null) {
            vehicle.setVehicleType(dto.getVehicleType());
        }
        if (dto.getRegistrationNo() != null) {
            vehicle.setRegistrationNo(dto.getRegistrationNo());
        }
        if (dto.getCapacity() != null) {
            vehicle.setCapacity(dto.getCapacity());
        }
        if (dto.getDriverName() != null) {
            vehicle.setDriverName(dto.getDriverName());
        }
        if (dto.getStatus() != null) {
            vehicle.setStatus(dto.getStatus());
        }

        return VehicleDTO.from(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle not found: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ══ DRIVER MANAGEMENT ═══════════════════════════════════════

    @Transactional(readOnly = true)
    public List<DriverDTO> getAllDrivers() {
        return driverRepository.findAll()
                .stream()
                .map(DriverDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public DriverDTO addDriver(DriverDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new BadRequestException("Driver email is required.");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email already in use: " + dto.getEmail());
        }

        String rawPassword = (dto.getPassword() != null && !dto.getPassword().isBlank())
                ? dto.getPassword()
                : "Driver@123";

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(rawPassword))
                .phone(dto.getPhone())
                .role(Role.DRIVER)
                .build();

        userRepository.save(user);

        Driver driver = Driver.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .vehicleAssigned(dto.getVehicleAssigned())
                .availability(dto.getAvailability() != null
                        ? dto.getAvailability()
                        : AvailabilityStatus.OFF_DUTY)
                .user(user)
                .totalTrips(0)
                .build();

        return DriverDTO.from(driverRepository.save(driver));
    }

    @Transactional
    public DriverDTO updateDriver(Long id, DriverDTO dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + id));

        if (dto.getName() != null) {
            driver.setName(dto.getName());
        }
        if (dto.getPhone() != null) {
            driver.setPhone(dto.getPhone());
        }
        if (dto.getVehicleAssigned() != null) {
            driver.setVehicleAssigned(dto.getVehicleAssigned());
        }
        if (dto.getAvailability() != null) {
            driver.setAvailability(dto.getAvailability());
        }

        return DriverDTO.from(driverRepository.save(driver));
    }

    @Transactional
    public void deleteDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + id));

        if (driver.getUser() != null) {
            userRepository.delete(driver.getUser());
        }

        driverRepository.delete(driver);
    }

    // ══ ANALYTICS ═══════════════════════════════════════════════

    @Transactional(readOnly = true)
    public AnalyticsDTO getAnalytics() {
        List<TransportRequest> all = requestRepository.findAll();
        List<Driver> drivers = driverRepository.findAll();
        List<Vehicle> fleet = vehicleRepository.findAll();

        Map<String, Long> monthly = buildMonthlyBreakdown(all);

        return AnalyticsDTO.builder()
                .totalRequests(all.size())
                .completedRequests(count(all, RequestStatus.COMPLETED))
                .cancelledRequests(count(all, RequestStatus.CANCELLED))
                .pendingRequests(count(all, RequestStatus.PENDING))
                .activeRequests(count(all, RequestStatus.IN_PROGRESS)
                        + count(all, RequestStatus.ACCEPTED))
                .ambulanceCount(countType(all, ServiceType.AMBULANCE))
                .erickshawCount(countType(all, ServiceType.ERICKSHAW))
                .indentaCount(countType(all, ServiceType.INDENTA))
                .studentRequests(countRole(all, Role.STUDENT))
                .teacherRequests(countRole(all, Role.TEACHER))
                .staffRequests(countRole(all, Role.STAFF))
                .totalVehicles(fleet.size())
                .availableVehicles(fleet.stream()
                        .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                        .count())
                .totalDrivers(drivers.size())
                .onDutyDrivers(drivers.stream()
                        .filter(d -> d.getAvailability() == AvailabilityStatus.ON_DUTY)
                        .count())
                .avgResponseTimeMinutes(4.2)
                .monthlyBreakdown(monthly)
                .build();
    }

    // ── private helpers ────────────────────────────────────────

    private long count(List<TransportRequest> list, RequestStatus status) {
        return list.stream()
                .filter(r -> r.getStatus() == status)
                .count();
    }

    private long countType(List<TransportRequest> list, ServiceType type) {
        return list.stream()
                .filter(r -> r.getServiceType() == type)
                .count();
    }

    private long countRole(List<TransportRequest> list, Role role) {
        return list.stream()
                .filter(r -> r.getRequester() != null && r.getRequester().getRole() == role)
                .count();
    }

    private Map<String, Long> buildMonthlyBreakdown(List<TransportRequest> all) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM");
        LinkedHashMap<String, Long> result = new LinkedHashMap<>();

        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime month = now.minusMonths(i);
            String label = month.format(fmt);

            long count = all.stream()
                    .filter(r -> r.getCreatedAt() != null
                            && r.getCreatedAt().getYear() == month.getYear()
                            && r.getCreatedAt().getMonth() == month.getMonth())
                    .count();

            result.put(label, count);
        }

        return result;
    }
}
