package com.example.InfoByte.model;

import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;

@Data // ✅ FIX: Add @Data
public class ArticleStats {

    private long viewCount;
    private long likeCount;
    private long bookmarkCount;
    private long shareCount;
    private long readCount;

    @Indexed
    private long engagementScore; // For "Trending" feed

    public ArticleStats() {
        this.viewCount = 0;
        this.likeCount = 0;
        this.bookmarkCount = 0;
        this.shareCount = 0;
        this.readCount = 0;
        this.engagementScore = 0;
    }

    // --- Helper Methods for InteractionService ---

    public void incrementViews() {
        this.viewCount++;
        updateEngagementScore();
    }
    
    public void incrementLikes() {
        this.likeCount++;
        updateEngagementScore();
    }
    
    public void decrementLikes() {
        this.likeCount = Math.max(0, this.likeCount - 1);
        updateEngagementScore();
    }

    public void incrementBookmarks() {
        this.bookmarkCount++;
        updateEngagementScore();
    }

    public void decrementBookmarks() {
        this.bookmarkCount = Math.max(0, this.bookmarkCount - 1);
        updateEngagementScore();
    }

    public void incrementShares() {
        this.shareCount++;
        updateEngagementScore();
    }

    public void incrementReads() {
        this.readCount++;
        updateEngagementScore();
    }

    // Simple scoring: likes=5, bookmarks=3, shares=3, reads=2, views=1
    private void updateEngagementScore() {
        this.engagementScore = (this.likeCount * 5) +
                               (this.bookmarkCount * 3) +
                               (this.shareCount * 3) +
                               (this.readCount * 2) +
                               this.viewCount;
    }
}