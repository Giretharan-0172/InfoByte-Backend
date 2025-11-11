package com.example.InfoByte.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.IndexDirection;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "articles")
public class Article {
    @Id
    private String id;
    
    @TextIndexed
    private String title;
    
    private String originalContent;
    private String sourceUrl;
    
    private String imageUrl;
    
    @Indexed
    private String category;
    
    @TextIndexed
    private String summary;
    
    private List<Double> embedding;

    // ✅ NEW: Track if AI processing is done
    @Indexed
    private boolean processed = false;

    @Indexed(direction = IndexDirection.DESCENDING)
    @CreatedDate
    private LocalDateTime createdAt;

    private ArticleStats stats;

    public Article() {
        this.stats = new ArticleStats();
        this.processed = false;
    }
}