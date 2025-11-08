package com.example.InfoByte.dto;

import com.example.InfoByte.model.Article;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor; // ✅ FIX: Add this
import java.util.List;

@Data // ✅ FIX: Add this
@NoArgsConstructor // ✅ FIX: Add this
@AllArgsConstructor
public class FeedResponse {
    private String message;
    private List<Article> articles;
    private long totalArticles;
    private int totalPages;
    private int currentPage;
}