package com.example.InfoByte.dto;

import lombok.Data;
import java.util.List;

@Data // ✅ FIX: Add this
public class UpdateInterestsRequest {
    private List<String> interests;
}