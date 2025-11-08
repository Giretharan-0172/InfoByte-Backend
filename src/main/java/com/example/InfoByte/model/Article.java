package com.example.InfoByte.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "articles")
public class Article {
    @Id
    private String id;
    private String title;
    private String originalContent;
    private String sourceUrl;
    private String category;
    private String summary;
    private List<Double> embedding;
}