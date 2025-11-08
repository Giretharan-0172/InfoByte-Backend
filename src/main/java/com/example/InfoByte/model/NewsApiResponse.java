package com.example.InfoByte.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class NewsApiResponse {
    private String status;
    private int totalResults;
    private List<ApiArticle> articles;
}