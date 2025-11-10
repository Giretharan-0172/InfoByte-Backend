package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.ArticleStats;
import com.example.InfoByte.repository.ArticleRepository;
import com.example.InfoByte.service.NotificationService;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleProcessingService {

    private final AIService aiService;
    private final ArticleRepository articleRepository;
    private final NotificationService notificationService;

    public ArticleProcessingService(AIService aiService, ArticleRepository articleRepository, NotificationService notificationService) {
        this.aiService = aiService;
        this.articleRepository = articleRepository;
        this.notificationService = notificationService;
    }

    // ✅ UPDATED METHOD - Added imageUrl parameter
    public Article processAndSaveArticle(String title, String content, String sourceUrl, String internalCategoryName, String imageUrl) {
        String summary = aiService.summarize(content);
        List<Double> embedding = aiService.embed(content);

        Article article = new Article();
        article.setTitle(title);
        article.setOriginalContent(content);
        article.setSourceUrl(sourceUrl);
        article.setSummary(summary);
        article.setCategory(internalCategoryName);
        article.setEmbedding(embedding);
        
        // ✅ SET IMAGE URL
        article.setImageUrl(imageUrl);

        // Initialize new fields
        article.setCreatedAt(LocalDateTime.now());
        article.setStats(new ArticleStats());

        Article saved = articleRepository.save(article);
        
        // Create notifications
        notificationService.createNotificationForCategory(
            internalCategoryName, title, saved.getId()
        );
        
        return saved;
    }
}