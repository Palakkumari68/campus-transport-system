package com.campus.transport.repository;

import com.campus.transport.entity.Driver;
import com.campus.transport.entity.User;
import com.campus.transport.enums.AvailabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);
    Optional<Driver> findByEmail(String email);
    List<Driver> findByAvailability(AvailabilityStatus availability);
}
