package com.campus.transport.service;

import com.campus.transport.dto.RequestCreateDTO;
import com.campus.transport.dto.RequestResponseDTO;
import com.campus.transport.entity.TransportRequest;
import com.campus.transport.entity.User;
import com.campus.transport.enums.RequestStatus;
import com.campus.transport.enums.ServiceType;
import com.campus.transport.exception.BadRequestException;
import com.campus.transport.exception.ResourceNotFoundException;
import com.campus.transport.repository.TransportRequestRepository;
import com.campus.transport.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final TransportRequestRepository requestRepository;
    private final UserRepository             userRepository;

    // ── Create a new request ───────────────────────────────────
    @Transactional
    public RequestResponseDTO createRequest(RequestCreateDTO dto, String userEmail) {
        User requester = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TransportRequest request = TransportRequest.builder()
                .requester(requester)
                .serviceType(dto.getServiceType())
                .status(RequestStatus.PENDING)
                .pickupLocation(dto.getPickupLocation())
                .dropLocation(dto.getDropLocation())
                .description(dto.getDescription())
                .passengers(dto.getPassengers())
                .purpose(dto.getPurpose())
                // Ambulance fields
                .patientName(dto.getPatientName())
                .rollNumber(dto.getRollNumber())
                .emergencyType(dto.getEmergencyType())
                .contactNumber(dto.getContactNumber())
                // Indenta fields
                .tripPurpose(dto.getTripPurpose())
                .destination(dto.getDestination())
                .numberOfStudents(dto.getNumberOfStudents())
                .facultyIncharge(dto.getFacultyIncharge())
                .approvalRef(dto.getApprovalRef())
                .travelDate(dto.getTravelDate())
                .returnDate(dto.getReturnDate())
                .build();

        return RequestResponseDTO.from(requestRepository.save(request));
    }

    // ── Get all requests for the logged-in user ────────────────
    @Transactional(readOnly = true)
    public List<RequestResponseDTO> getMyRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return requestRepository
                .findByRequesterOrderByCreatedAtDesc(user)
                .stream()
                .map(RequestResponseDTO::from)
                .collect(Collectors.toList());
    }

    // ── Get a single request by ID ─────────────────────────────
    @Transactional(readOnly = true)
    public RequestResponseDTO getRequestById(Long id) {
        return RequestResponseDTO.from(findOrThrow(id));
    }

    // ── Get all requests (admin) with optional filters ─────────
    @Transactional(readOnly = true)
    public List<RequestResponseDTO> getAllRequests(String statusStr, String typeStr) {
        RequestStatus status = parseEnum(RequestStatus.class, statusStr);
        ServiceType   type   = parseEnum(ServiceType.class, typeStr);

        return requestRepository
                .findByFilters(status, type)
                .stream()
                .map(RequestResponseDTO::from)
                .collect(Collectors.toList());
    }

    // ── Update request status (admin override) ─────────────────
    @Transactional
    public RequestResponseDTO updateStatus(Long id, RequestStatus newStatus) {
        TransportRequest request = findOrThrow(id);

        validateTransition(request.getStatus(), newStatus);
        request.setStatus(newStatus);

        return RequestResponseDTO.from(requestRepository.save(request));
    }

    // ── Internal helpers ───────────────────────────────────────
    private TransportRequest findOrThrow(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Request not found with id: " + id));
    }

    private void validateTransition(RequestStatus current, RequestStatus next) {
        // CANCELLED and COMPLETED are terminal states
        if (current == RequestStatus.CANCELLED || current == RequestStatus.COMPLETED) {
            throw new BadRequestException(
                "Cannot change status from " + current + " to " + next);
        }
    }

    private <E extends Enum<E>> E parseEnum(Class<E> clazz, String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Enum.valueOf(clazz, value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
