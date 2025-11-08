package com.example.InfoByte.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class ApiArticle {
    private String title;
    private String description;
    private String url;
    private String content;
}