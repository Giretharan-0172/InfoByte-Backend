package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.ArticleStats; // Import ArticleStats
import com.example.InfoByte.repository.ArticleRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;

@Service
public class ArticleProcessingService {

    private final AIService aiService;
    private final ArticleRepository articleRepository;

    public ArticleProcessingService(AIService aiService, ArticleRepository articleRepository) {
        this.aiService = aiService;
        this.articleRepository = articleRepository;
    }

    public Article processAndSaveArticle(String title, String content, String sourceUrl, String internalCategoryName) {
        String summary = aiService.summarize(content);
        
        // --- FIX ---
        // Changed 'aiDervice' to 'aiService'
        List<Double> embedding = aiService.embed(content);

        Article article = new Article();
        article.setTitle(title);
        article.setOriginalContent(content);
        article.setSourceUrl(sourceUrl);
        article.setSummary(summary);
        article.setCategory(internalCategoryName);
        article.setEmbedding(embedding);

        // --- NEW ---
        // Initialize new fields
        article.setCreatedAt(LocalDateTime.now());
        article.setStats(new ArticleStats()); // Initialize the stats

        return articleRepository.save(article);
    }
}