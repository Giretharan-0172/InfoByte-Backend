package com.example.InfoByte.controller;

import com.example.InfoByte.dto.LoginRequest;
import com.example.InfoByte.dto.RegisterRequest;
import com.example.InfoByte.dto.UpdateInterestsRequest;
import com.example.InfoByte.dto.AuthResponse;
import com.example.InfoByte.model.User;
import com.example.InfoByte.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(
                request.getEmail(),
                request.getName(),
                request.getPassword(),
                request.getInterests()
            );
            return ResponseEntity.ok(new AuthResponse(
                "Registration successful",
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getInterests()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null, null, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new AuthResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getInterests()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null, null, null));
        }
    }

    @PutMapping("/{userId}/interests")
    public ResponseEntity<AuthResponse> updateInterests(
            @PathVariable String userId,
            @RequestBody UpdateInterestsRequest request) {
        try {
            User user = userService.updateUserInterests(userId, request.getInterests());
            return ResponseEntity.ok(new AuthResponse(
                "Interests updated successfully",
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getInterests()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse(e.getMessage(), null, null, null, null));
        }
    }
}
