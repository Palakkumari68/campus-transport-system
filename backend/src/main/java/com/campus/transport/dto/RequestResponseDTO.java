package com.campus.transport.dto;

import com.campus.transport.entity.TransportRequest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestResponseDTO {

    private Long id;
    private String serviceType;
    private String status;

    // Requester info
    private String requesterName;
    private String requesterRole;
    private String requesterPhone;
    private String requesterRoll;

    // Location
    private String pickupLocation;
    private String dropLocation;

    // Ambulance
    private String patientName;
    private String emergencyType;
    private String contactNumber;

    // Indenta
    private String tripPurpose;
    private String destination;
    private Integer numberOfStudents;
    private String facultyIncharge;
    private String approvalRef;
    private String travelDate;
    private String returnDate;

    // Common
    private String description;
    private Integer passengers;
    private String purpose;

    // Driver
    private String driverName;
    private Long driverId;
    private String driverPhone;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ── Static factory from entity ─────────────────────────────
    public static RequestResponseDTO from(TransportRequest r) {
        RequestResponseDTO dto = new RequestResponseDTO();

        dto.setId(r.getId());
        dto.setServiceType(r.getServiceType() != null ? r.getServiceType().name() : null);
        dto.setStatus(r.getStatus() != null ? r.getStatus().name() : null);

        if (r.getRequester() != null) {
            dto.setRequesterName(r.getRequester().getName());
            dto.setRequesterRole(
                    r.getRequester().getRole() != null ? r.getRequester().getRole().name() : null
            );
            dto.setRequesterPhone(r.getRequester().getPhone());
            dto.setRequesterRoll(r.getRequester().getRollNumber());
        }

        dto.setPickupLocation(r.getPickupLocation());
        dto.setDropLocation(r.getDropLocation());

        dto.setPatientName(r.getPatientName());
        dto.setEmergencyType(r.getEmergencyType());
        dto.setContactNumber(r.getContactNumber());

        dto.setTripPurpose(r.getTripPurpose());
        dto.setDestination(r.getDestination());
        dto.setNumberOfStudents(r.getNumberOfStudents());
        dto.setFacultyIncharge(r.getFacultyIncharge());
        dto.setApprovalRef(r.getApprovalRef());
        dto.setTravelDate(r.getTravelDate());
        dto.setReturnDate(r.getReturnDate());

        dto.setDescription(r.getDescription());
        dto.setPassengers(r.getPassengers());
        dto.setPurpose(r.getPurpose());

        if (r.getAssignedDriver() != null) {
            dto.setDriverName(r.getAssignedDriver().getName());
            dto.setDriverId(r.getAssignedDriver().getId());
            dto.setDriverPhone(r.getAssignedDriver().getPhone());
        }

        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());

        return dto;
    }
}
