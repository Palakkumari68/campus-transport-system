package com.campus.transport.controller;

import com.campus.transport.dto.AnalyticsDTO;
import com.campus.transport.dto.DriverDTO;
import com.campus.transport.dto.VehicleDTO;
import com.campus.transport.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ══ VEHICLE ENDPOINTS ══════════════════════════════════════

    // GET /api/admin/vehicles
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(adminService.getAllVehicles());
    }

    // POST /api/admin/vehicle/add
    @PostMapping("/vehicle/add")
    public ResponseEntity<VehicleDTO> addVehicle(
            @Valid @RequestBody VehicleDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminService.addVehicle(dto));
    }

    // PUT /api/admin/vehicle/{id}
    @PutMapping("/vehicle/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(
            @PathVariable Long id,
            @RequestBody VehicleDTO dto) {
        return ResponseEntity.ok(adminService.updateVehicle(id, dto));
    }

    // DELETE /api/admin/vehicle/{id}
    @DeleteMapping("/vehicle/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        adminService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    // ══ DRIVER ENDPOINTS ═══════════════════════════════════════

    // GET /api/admin/drivers
    @GetMapping("/drivers")
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        return ResponseEntity.ok(adminService.getAllDrivers());
    }

    // POST /api/admin/driver/add
    // Creates both a User account and a Driver profile
    @PostMapping("/driver/add")
    public ResponseEntity<DriverDTO> addDriver(
            @Valid @RequestBody DriverDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(adminService.addDriver(dto));
    }

    // PUT /api/admin/driver/{id}
    @PutMapping("/driver/{id}")
    public ResponseEntity<DriverDTO> updateDriver(
            @PathVariable Long id,
            @RequestBody DriverDTO dto) {
        return ResponseEntity.ok(adminService.updateDriver(id, dto));
    }

    // DELETE /api/admin/driver/{id}
    @DeleteMapping("/driver/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
        adminService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

    // ══ ANALYTICS ENDPOINT ═════════════════════════════════════

    // GET /api/admin/analytics
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
