-- ============================================================
--  Smart Campus Emergency & Transport System — MySQL Schema
--  Run this manually OR let Hibernate auto-create with ddl-auto=update
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_transport
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campus_transport;

-- ── users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    roll_number VARCHAR(50),
    phone       VARCHAR(20),
    role        ENUM('STUDENT','TEACHER','STAFF','DRIVER','ADMIN') NOT NULL,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) ENGINE=InnoDB;

-- ── drivers ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
    id               BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    phone            VARCHAR(20),
    license_number   VARCHAR(50)  NOT NULL UNIQUE,
    vehicle_assigned VARCHAR(100),
    availability     ENUM('ON_DUTY','OFF_DUTY','ON_BREAK') NOT NULL DEFAULT 'OFF_DUTY',
    user_id          BIGINT       UNIQUE,
    total_trips      INT          DEFAULT 0,
    created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_drivers_availability (availability)
) ENGINE=InnoDB;

-- ── vehicles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
    id              BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    vehicle_type    ENUM('AMBULANCE','ERICKSHAW','INDENTA') NOT NULL,
    registration_no VARCHAR(20)  NOT NULL UNIQUE,
    capacity        VARCHAR(50),
    driver_name     VARCHAR(100),
    driver_id       BIGINT,
    status          ENUM('AVAILABLE','IN_TRIP','ON_CALL','PARKED','MAINTENANCE')
                    NOT NULL DEFAULT 'AVAILABLE',
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_vehicles_status (status),
    INDEX idx_vehicles_type   (vehicle_type)
) ENGINE=InnoDB;

-- ── transport_requests ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transport_requests (
    id                BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    requester_id      BIGINT       NOT NULL,
    service_type      ENUM('AMBULANCE','ERICKSHAW','INDENTA') NOT NULL,
    status            ENUM('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED')
                      NOT NULL DEFAULT 'PENDING',

    -- Location
    pickup_location   VARCHAR(255),
    drop_location     VARCHAR(255),

    -- Ambulance-specific
    patient_name      VARCHAR(100),
    roll_number       VARCHAR(50),
    emergency_type    VARCHAR(50),
    contact_number    VARCHAR(20),

    -- Indenta-specific
    trip_purpose      VARCHAR(255),
    destination       VARCHAR(255),
    number_of_students INT,
    faculty_incharge  VARCHAR(100),
    approval_ref      VARCHAR(100),
    travel_date       VARCHAR(20),
    return_date       VARCHAR(20),

    -- Common optional fields
    description       TEXT,
    passengers        INT,
    purpose           VARCHAR(100),

    -- Assignments
    driver_id         BIGINT,
    vehicle_id        BIGINT,

    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (requester_id) REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (driver_id)    REFERENCES drivers(id)  ON DELETE SET NULL,
    FOREIGN KEY (vehicle_id)   REFERENCES vehicles(id) ON DELETE SET NULL,

    INDEX idx_req_status       (status),
    INDEX idx_req_service_type (service_type),
    INDEX idx_req_requester    (requester_id),
    INDEX idx_req_driver       (driver_id),
    INDEX idx_req_created      (created_at)
) ENGINE=InnoDB;

-- ── Sample data (matches DataSeeder.java) ─────────────────────
-- These are only needed if you run schema.sql manually without DataSeeder.
-- If using Spring Boot + DataSeeder, skip this section.

/*
INSERT INTO users (name, email, password, role, phone) VALUES
('Dr. S. Mehta',  'admin@campus.edu',  '$2a$10$...', 'ADMIN',  '+91-9800000001'),
('Suresh Kumar',  'suresh@campus.edu', '$2a$10$...', 'DRIVER', '+91-9811111111'),
('Ravi Sharma',   'ravi@campus.edu',   '$2a$10$...', 'DRIVER', '+91-9822222222'),
('Mohan Lal',     'mohan@campus.edu',  '$2a$10$...', 'DRIVER', '+91-9833333333');

INSERT INTO drivers (name, email, phone, license_number, availability, user_id) VALUES
('Suresh Kumar', 'suresh@campus.edu', '+91-9811111111', 'DL-0420110001', 'OFF_DUTY', 2),
('Ravi Sharma',  'ravi@campus.edu',   '+91-9822222222', 'DL-0420110002', 'OFF_DUTY', 3),
('Mohan Lal',    'mohan@campus.edu',  '+91-9833333333', 'DL-0420110003', 'OFF_DUTY', 4);

INSERT INTO vehicles (vehicle_type, registration_no, capacity, status) VALUES
('AMBULANCE', 'UP32 AA 0001', '2 patients', 'AVAILABLE'),
('ERICKSHAW', 'UP32 AB 1234', '4 persons',  'AVAILABLE'),
('ERICKSHAW', 'UP32 AB 5678', '4 persons',  'AVAILABLE'),
('INDENTA',   'UP32 AC 9101', '50 seats',   'AVAILABLE');
*/
