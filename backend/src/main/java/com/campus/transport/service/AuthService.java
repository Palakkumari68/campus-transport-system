package com.campus.transport.service;

import com.campus.transport.dto.AuthResponse;
import com.campus.transport.dto.LoginRequest;
import com.campus.transport.dto.RegisterRequest;
import com.campus.transport.entity.Driver;
import com.campus.transport.entity.User;
import com.campus.transport.enums.AvailabilityStatus;
import com.campus.transport.enums.Role;
import com.campus.transport.exception.BadRequestException;
import com.campus.transport.repository.DriverRepository;
import com.campus.transport.repository.UserRepository;
import com.campus.transport.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    // ── Register ───────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already in use: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .rollNumber(req.getRollNumber())
                .phone(req.getPhone())
                .role(req.getRole())
                .build();

        userRepository.save(user);

        // If registering as a driver → create driver profile (NO license now)
        if (req.getRole() == Role.DRIVER) {
            Driver driver = Driver.builder()
                    .name(req.getName())
                    .email(req.getEmail())
                    .phone(req.getPhone())
                    .availability(AvailabilityStatus.OFF_DUTY)
                    .user(user)
                    .totalTrips(0)
                    // ❌ licenseNumber removed completely
                    .build();

            driverRepository.save(driver);
        }

        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ── Login ──────────────────────────────────────────────────
    public AuthResponse login(LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()
                )
        );

        User user = (User) auth.getPrincipal();
        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}