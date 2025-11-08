package com.example.InfoByte.dto;

import lombok.Data;

@Data // ✅ FIX: Add this
public class LoginRequest {
    private String email;
    private String password;
}