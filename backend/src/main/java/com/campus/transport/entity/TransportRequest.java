package com.campus.transport.entity;

import com.campus.transport.enums.RequestStatus;
import com.campus.transport.enums.ServiceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transport_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who made this request
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false)
    private ServiceType serviceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    // Location fields
    @Column(name = "pickup_location")
    private String pickupLocation;

    @Column(name = "drop_location")
    private String dropLocation;

    // Ambulance-specific fields
    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "emergency_type")
    private String emergencyType;

    @Column(name = "contact_number")
    private String contactNumber;

    // Indenta-specific fields
    @Column(name = "trip_purpose")
    private String tripPurpose;

    @Column(name = "destination")
    private String destination;

    @Column(name = "number_of_students")
    private Integer numberOfStudents;

    @Column(name = "faculty_incharge")
    private String facultyIncharge;

    @Column(name = "approval_ref")
    private String approvalRef;

    @Column(name = "travel_date")
    private String travelDate;

    @Column(name = "return_date")
    private String returnDate;

    // Common
    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer passengers;

    private String purpose;

    // Assigned driver
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver assignedDriver;

    // Assigned vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle assignedVehicle;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = RequestStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
