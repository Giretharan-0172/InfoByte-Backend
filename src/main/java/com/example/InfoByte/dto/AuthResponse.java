package com.example.InfoByte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; // ✅ FIX: Add this
import java.util.List;

@Data // ✅ FIX: Add this
@NoArgsConstructor // ✅ FIX: Add this
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String userId;
    private String email;
    private String name;
    private List<String> interests;
}