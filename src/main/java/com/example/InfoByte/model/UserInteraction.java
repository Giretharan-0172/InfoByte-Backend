package com.example.InfoByte.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data // ✅ FIX: Add @Data
@Document(collection = "user_interactions")
@CompoundIndex(name = "user_article_idx", def = "{'userId' : 1, 'articleId' : 1}", unique = true)
public class UserInteraction {

    @Id
    private String id;
    private String userId;
    private String articleId;

    private boolean liked;
    private LocalDateTime likedAt;

    private boolean bookmarked;
    private LocalDateTime bookmarkedAt;

    private boolean shared;
    private LocalDateTime sharedAt;

    private boolean read;
    private LocalDateTime readAt;

    private long viewCount;
    private LocalDateTime lastViewedAt;
    private long readTime; // Total time in seconds

    public UserInteraction() {
        this.liked = false;
        this.bookmarked = false;
        this.shared = false;
        this.read = false;
        this.viewCount = 0;
        this.readTime = 0;
    }
}