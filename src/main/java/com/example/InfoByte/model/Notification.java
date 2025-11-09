package com.example.InfoByte.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String type; // "NEW_ARTICLE", "TRENDING", "FOLLOW_UP"
    private String title;
    private String message;
    private String articleId;
    private String category;
    
    @Indexed
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private boolean read = false;
}