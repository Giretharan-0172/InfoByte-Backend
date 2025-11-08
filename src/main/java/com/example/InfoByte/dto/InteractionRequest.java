package com.example.InfoByte.dto;

import lombok.Data;

@Data
public class InteractionRequest {
    private String userId;
    private String articleId;
    private Integer readTimeSeconds;  // Optional: for tracking reading time
}
