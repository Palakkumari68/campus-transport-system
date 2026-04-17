package com.campus.transport.controller;

import com.campus.transport.dto.RequestCreateDTO;
import com.campus.transport.dto.RequestResponseDTO;
import com.campus.transport.dto.StatusUpdateDTO;
import com.campus.transport.service.RequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/request")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;

    // POST /api/request/create
    // Roles: STUDENT, TEACHER, STAFF, ADMIN
    @PostMapping("/create")
    public ResponseEntity<RequestResponseDTO> create(
            @Valid @RequestBody RequestCreateDTO dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(requestService.createRequest(dto, userDetails.getUsername()));
    }

    // GET /api/request/my
    // Returns all requests made by the logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<RequestResponseDTO>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                requestService.getMyRequests(userDetails.getUsername()));
    }

    // GET /api/request/{id}
    // Returns a single request by ID (owner or admin/driver)
    @GetMapping("/{id}")
    public ResponseEntity<RequestResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    // GET /api/request/{id}/status
    // Lightweight endpoint just to poll current status
    @GetMapping("/{id}/status")
    public ResponseEntity<String> getStatus(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id).getStatus());
    }

    // GET /api/request/all?status=PENDING&type=AMBULANCE
    // Admin only — filtered list of all requests
    @GetMapping("/all")
    public ResponseEntity<List<RequestResponseDTO>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {

        return ResponseEntity.ok(requestService.getAllRequests(status, type));
    }

    // PUT /api/request/{id}/status
    // Admin can force-update any request status
    @PutMapping("/{id}/status")
    public ResponseEntity<RequestResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDTO dto) {

        return ResponseEntity.ok(
                requestService.updateStatus(id, dto.getStatus()));
    }
}
