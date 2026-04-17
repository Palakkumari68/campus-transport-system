package com.campus.transport.dto;

import com.campus.transport.entity.Driver;
import com.campus.transport.enums.AvailabilityStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DriverDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    private String phone;

    // ❌ licenseNumber removed

    private String vehicleAssigned;
    private AvailabilityStatus availability;
    private Integer totalTrips;
    private LocalDateTime createdAt;

    // password only used on create, never returned
    private String password;

    public static DriverDTO from(Driver d) {
        DriverDTO dto = new DriverDTO();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setEmail(d.getEmail());
        dto.setPhone(d.getPhone());
        // ❌ removed license mapping
        dto.setVehicleAssigned(d.getVehicleAssigned());
        dto.setAvailability(d.getAvailability());
        dto.setTotalTrips(d.getTotalTrips());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }
}