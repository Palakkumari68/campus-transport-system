package com.campus.transport.repository;

import com.campus.transport.entity.Vehicle;
import com.campus.transport.enums.ServiceType;
import com.campus.transport.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(VehicleStatus status);
    List<Vehicle> findByVehicleType(ServiceType vehicleType);
    List<Vehicle> findByStatusAndVehicleType(VehicleStatus status, ServiceType type);
}
