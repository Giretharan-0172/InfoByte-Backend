package com.example.InfoByte.dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateInterestsRequest {
    private List<String> interests;
}