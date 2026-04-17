package com.campus.transport.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class AnalyticsDTO {

    private long totalRequests;
    private long completedRequests;
    private long cancelledRequests;
    private long pendingRequests;
    private long activeRequests;

    // Counts per service type
    private long ambulanceCount;
    private long erickshawCount;
    private long indentaCount;

    // Counts per user role
    private long studentRequests;
    private long teacherRequests;
    private long staffRequests;

    // Fleet
    private long totalVehicles;
    private long availableVehicles;

    // Drivers
    private long totalDrivers;
    private long onDutyDrivers;

    // Estimated average response time in minutes (static for now)
    private double avgResponseTimeMinutes;

    // Monthly breakdown: { "Jan": 12, "Feb": 18, ... }
    private Map<String, Long> monthlyBreakdown;
}
