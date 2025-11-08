package com.example.InfoByte.dto;

import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String name;
    private String password;
    private List<String> interests;
}