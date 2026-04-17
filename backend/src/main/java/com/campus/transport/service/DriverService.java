package com.campus.transport.service;

import com.campus.transport.dto.DriverDTO;
import com.campus.transport.dto.RequestResponseDTO;
import com.campus.transport.dto.StatusUpdateDTO;
import com.campus.transport.entity.Driver;
import com.campus.transport.entity.TransportRequest;
import com.campus.transport.entity.User;
import com.campus.transport.enums.AvailabilityStatus;
import com.campus.transport.enums.RequestStatus;
import com.campus.transport.enums.VehicleStatus;
import com.campus.transport.exception.BadRequestException;
import com.campus.transport.exception.ResourceNotFoundException;
import com.campus.transport.repository.DriverRepository;
import com.campus.transport.repository.TransportRequestRepository;
import com.campus.transport.repository.UserRepository;
import com.campus.transport.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository           driverRepository;
    private final UserRepository             userRepository;
    private final TransportRequestRepository requestRepository;
    private final VehicleRepository          vehicleRepository;

    // ── Get all requests visible to this driver ────────────────
    // Returns: PENDING (not yet assigned) + requests assigned to this driver
    @Transactional(readOnly = true)
    public List<RequestResponseDTO> getDriverRequests(String email) {
        Driver driver = getDriverByEmail(email);

        // Pending requests (anyone can see and accept)
        List<TransportRequest> pending =
                requestRepository.findByStatusOrderByCreatedAtAsc(RequestStatus.PENDING);

        // Requests already assigned to this driver
        List<TransportRequest> mine =
                requestRepository.findByAssignedDriverOrderByCreatedAtDesc(driver);

        // Merge, deduplicate
        pending.removeIf(p -> mine.stream().anyMatch(m -> m.getId().equals(p.getId())));
        pending.addAll(mine);

        return pending.stream()
                .map(RequestResponseDTO::from)
                .collect(Collectors.toList());
    }

    // ── Accept a request ──────────────────────────────────────
    @Transactional
    public RequestResponseDTO acceptRequest(Long requestId, String driverEmail) {
        Driver driver = getDriverByEmail(driverEmail);

        // Driver must be on duty
        if (driver.getAvailability() == AvailabilityStatus.OFF_DUTY) {
            throw new BadRequestException("You must be ON_DUTY to accept requests.");
        }

        // Driver must not already have an active trip
        List<TransportRequest> active = requestRepository.findActiveByDriver(driver);
        if (!active.isEmpty()) {
            throw new BadRequestException(
                "You already have an active trip (REQ-" + active.get(0).getId() + "). "
                + "Complete it before accepting a new one.");
        }

        TransportRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Request not found: " + requestId));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException(
                "Request is no longer pending. Current status: " + request.getStatus());
        }

        request.setAssignedDriver(driver);
        request.setStatus(RequestStatus.ACCEPTED);

        return RequestResponseDTO.from(requestRepository.save(request));
    }

    // ── Decline a request ──────────────────────────────────────
    @Transactional
    public RequestResponseDTO declineRequest(Long requestId, String driverEmail) {
        TransportRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Request not found: " + requestId));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Can only decline PENDING requests.");
        }

        // Just leave it pending for another driver — or mark cancelled
        request.setStatus(RequestStatus.CANCELLED);
        return RequestResponseDTO.from(requestRepository.save(request));
    }

    // ── Update trip status (ACCEPTED → IN_PROGRESS → COMPLETED) ─
    @Transactional
    public RequestResponseDTO updateTripStatus(Long requestId,
                                               RequestStatus newStatus,
                                               String driverEmail) {
        Driver driver = getDriverByEmail(driverEmail);

        TransportRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Request not found: " + requestId));

        // Ensure this driver owns this request
        if (request.getAssignedDriver() == null ||
                !request.getAssignedDriver().getId().equals(driver.getId())) {
            throw new BadRequestException("This request is not assigned to you.");
        }

        // Validate state machine transitions
        validateDriverTransition(request.getStatus(), newStatus);
        request.setStatus(newStatus);

        // When trip completes, increment driver's counter
        if (newStatus == RequestStatus.COMPLETED) {
            driver.setTotalTrips(driver.getTotalTrips() + 1);
            driverRepository.save(driver);
        }

        return RequestResponseDTO.from(requestRepository.save(request));
    }

    // ── Update driver availability ─────────────────────────────
    @Transactional
    public DriverDTO updateAvailability(String driverEmail, AvailabilityStatus status) {
        Driver driver = getDriverByEmail(driverEmail);
        driver.setAvailability(status);
        return DriverDTO.from(driverRepository.save(driver));
    }

    // ── Update driver profile ──────────────────────────────────
    @Transactional
public DriverDTO updateProfile(String driverEmail, DriverDTO dto) {
    Driver driver = getDriverByEmail(driverEmail);

    if (dto.getName() != null) 
        driver.setName(dto.getName());

    if (dto.getPhone() != null) 
        driver.setPhone(dto.getPhone());

    // ❌ license removed

    if (dto.getVehicleAssigned() != null) 
        driver.setVehicleAssigned(dto.getVehicleAssigned());

    if (dto.getAvailability() != null) 
        driver.setAvailability(dto.getAvailability());

    return DriverDTO.from(driverRepository.save(driver));
}

    // ── Get own profile ───────────────────────────────────────
    @Transactional(readOnly = true)
    public DriverDTO getProfile(String driverEmail) {
        return DriverDTO.from(getDriverByEmail(driverEmail));
    }

    // ── Internal helpers ──────────────────────────────────────
    private Driver getDriverByEmail(String email) {
        return driverRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Driver profile not found for: " + email));
    }

    private void validateDriverTransition(RequestStatus current, RequestStatus next) {
        boolean valid = switch (current) {
            case ACCEPTED    -> next == RequestStatus.IN_PROGRESS || next == RequestStatus.CANCELLED;
            case IN_PROGRESS -> next == RequestStatus.COMPLETED   || next == RequestStatus.CANCELLED;
            default          -> false;
        };
        if (!valid) {
            throw new BadRequestException(
                "Invalid status transition: " + current + " → " + next);
        }
    }
}
