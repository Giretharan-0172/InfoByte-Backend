package com.example.InfoByte.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
// ✅ FIX: Import the correct 'Direction' class
import org.springframework.data.mongodb.core.index.IndexDirection; 

import java.time.LocalDateTime;
import java.util.List;

@Data // ✅ FIX: Add @Data for getters, setters, etc.
@Document(collection = "articles")
public class Article {
    @Id
    private String id;
    private String title;
    private String originalContent;
    private String sourceUrl;
    
    @Indexed
    private String category;
    
    private String summary;
    private List<Double> embedding;

    // ✅ FIX: Add fields required by EnhancedFeedService and InteractionService
    @Indexed(direction = IndexDirection.DESCENDING) // Use IndexDirection
    @CreatedDate
    private LocalDateTime createdAt;

    private ArticleStats stats; // Add the stats object

    public Article() {
        this.stats = new ArticleStats(); // Initialize stats for new articles
    }
}