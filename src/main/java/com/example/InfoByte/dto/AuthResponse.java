package com.example.InfoByte.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String userId;
    private String email;
    private String name;
    private List<String> interests;
}