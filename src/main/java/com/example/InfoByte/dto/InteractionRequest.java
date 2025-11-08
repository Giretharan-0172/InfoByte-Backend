package com.example.InfoByte.dto;

import lombok.Data;

@Data // ✅ FIX: Add this
public class InteractionRequest {
    private String userId;
    private String articleId;
    private Integer readTimeSeconds;
}