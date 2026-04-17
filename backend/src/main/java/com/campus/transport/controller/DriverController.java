package com.campus.transport.controller;

import com.campus.transport.dto.DriverDTO;
import com.campus.transport.dto.RequestResponseDTO;
import com.campus.transport.dto.StatusUpdateDTO;
import com.campus.transport.enums.AvailabilityStatus;
import com.campus.transport.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    // GET /api/driver/requests
    // Returns pending requests + requests already assigned to this driver
    @GetMapping("/requests")
    public ResponseEntity<List<RequestResponseDTO>> getRequests(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.getDriverRequests(userDetails.getUsername()));
    }

    // PUT /api/driver/request/{id}/accept
    // Driver accepts a pending request — assigns it to themselves
    @PutMapping("/request/{id}/accept")
    public ResponseEntity<RequestResponseDTO> acceptRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.acceptRequest(id, userDetails.getUsername()));
    }

    // PUT /api/driver/request/{id}/decline
    // Driver declines a pending request
    @PutMapping("/request/{id}/decline")
    public ResponseEntity<RequestResponseDTO> declineRequest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.declineRequest(id, userDetails.getUsername()));
    }

    // PUT /api/driver/request/{id}/status
    // Driver advances trip: ACCEPTED → IN_PROGRESS → COMPLETED (or CANCELLED)
    @PutMapping("/request/{id}/status")
    public ResponseEntity<RequestResponseDTO> updateTripStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.updateTripStatus(
                        id, dto.getStatus(), userDetails.getUsername()));
    }

    // PUT /api/driver/availability
    // Driver toggles ON_DUTY / OFF_DUTY / ON_BREAK
    @PutMapping("/availability")
    public ResponseEntity<DriverDTO> updateAvailability(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {

        AvailabilityStatus status =
                AvailabilityStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(
                driverService.updateAvailability(
                        userDetails.getUsername(), status));
    }

    // GET /api/driver/profile
    // Driver views their own profile
    @GetMapping("/profile")
    public ResponseEntity<DriverDTO> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.getProfile(userDetails.getUsername()));
    }

    // PUT /api/driver/profile
    // Driver updates their own profile
    @PutMapping("/profile")
    public ResponseEntity<DriverDTO> updateProfile(
            @RequestBody DriverDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                driverService.updateProfile(userDetails.getUsername(), dto));
    }
}
