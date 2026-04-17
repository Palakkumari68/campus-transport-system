package com.campus.transport.repository;

import com.campus.transport.entity.Driver;
import com.campus.transport.entity.TransportRequest;
import com.campus.transport.entity.User;
import com.campus.transport.enums.RequestStatus;
import com.campus.transport.enums.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {

    // All requests for a specific user (ordered newest first)
    List<TransportRequest> findByRequesterOrderByCreatedAtDesc(User requester);

    // All requests assigned to a driver
    List<TransportRequest> findByAssignedDriverOrderByCreatedAtDesc(Driver driver);

    // All PENDING requests (driver inbox)
    List<TransportRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);

    // Pending requests for a specific service type (helps driver find relevant ones)
    List<TransportRequest> findByStatusAndServiceTypeOrderByCreatedAtAsc(
            RequestStatus status, ServiceType serviceType);

    // All requests with optional filters (admin view)
    @Query("SELECT r FROM TransportRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:serviceType IS NULL OR r.serviceType = :serviceType)")
    List<TransportRequest> findByFilters(
            @Param("status") RequestStatus status,
            @Param("serviceType") ServiceType serviceType);

    // Active trip for a driver (ACCEPTED or IN_PROGRESS)
    @Query("SELECT r FROM TransportRequest r WHERE r.assignedDriver = :driver " +
           "AND r.status IN ('ACCEPTED', 'IN_PROGRESS')")
    List<TransportRequest> findActiveByDriver(@Param("driver") Driver driver);

    // Today's requests (for analytics)
    @Query("SELECT r FROM TransportRequest r WHERE r.createdAt >= :start AND r.createdAt <= :end")
    List<TransportRequest> findByDateRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    // Count by status
    long countByStatus(RequestStatus status);

    // Count by service type
    long countByServiceType(ServiceType serviceType);
}
