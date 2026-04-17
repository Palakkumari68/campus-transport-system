package com.campus.transport.dto;

import com.campus.transport.entity.Vehicle;
import com.campus.transport.enums.ServiceType;
import com.campus.transport.enums.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VehicleDTO {

    private Long id;

    @NotNull(message = "Vehicle type is required")
    private ServiceType vehicleType;

    @NotBlank(message = "Registration number is required")
    private String registrationNo;

    private String capacity;
    private String driverName;
    private VehicleStatus status;
    private LocalDateTime createdAt;

    public static VehicleDTO from(Vehicle v) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(v.getId());
        dto.setVehicleType(v.getVehicleType());
        dto.setRegistrationNo(v.getRegistrationNo());
        dto.setCapacity(v.getCapacity());
        dto.setDriverName(v.getDriverName());
        dto.setStatus(v.getStatus());
        dto.setCreatedAt(v.getCreatedAt());
        return dto;
    }
}
