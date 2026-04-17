package com.campus.transport.entity;

import com.campus.transport.enums.ServiceType;
import com.campus.transport.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private ServiceType vehicleType;

    @Column(name = "registration_no", nullable = false, unique = true)
    private String registrationNo;

    private String capacity;

    @Column(name = "driver_name")
    private String driverName;

    // Optional FK to Driver table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver assignedDriver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = VehicleStatus.AVAILABLE;
    }
}
