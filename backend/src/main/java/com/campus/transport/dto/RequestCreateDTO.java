package com.campus.transport.dto;

import com.campus.transport.enums.ServiceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RequestCreateDTO {

    @NotNull(message = "Service type is required")
    private ServiceType serviceType;

    // Common
    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    private String dropLocation;
    private String description;
    private Integer passengers;
    private String purpose;

    // Ambulance-specific
    private String patientName;
    private String rollNumber;
    private String emergencyType;
    private String contactNumber;

    // E-Rickshaw specific
    private String date;
    private String time;

    // Indenta-specific
    private String tripPurpose;
    private String destination;
    private Integer numberOfStudents;
    private String facultyIncharge;
    private String approvalRef;
    private String travelDate;
    private String returnDate;
}
