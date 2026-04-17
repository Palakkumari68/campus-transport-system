package com.campus.transport.entity;

import com.campus.transport.enums.AvailabilityStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    // license number removed as required
    // If you want it later, you can add it back properly

    @Column(name = "vehicle_assigned")
    private String vehicleAssigned;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availability;

    // Link to the User account of this driver
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "total_trips")
    private Integer totalTrips;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();

        if (availability == null) {
            availability = AvailabilityStatus.OFF_DUTY;
        }

        if (totalTrips == null) {
            totalTrips = 0;
        }
    }
}
