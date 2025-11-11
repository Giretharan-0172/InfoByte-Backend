package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.ArticleStats;
import com.example.InfoByte.repository.ArticleRepository;
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

    // ✅ STEP 1: Just save the raw article (Processed = false)
    public void saveRawArticle(String title, String content, String sourceUrl, String internalCategoryName, String imageUrl) {
        Article article = new Article();
        article.setTitle(title);
        article.setOriginalContent(content);
        article.setSourceUrl(sourceUrl);
        article.setCategory(internalCategoryName);
        article.setImageUrl(imageUrl);
        article.setCreatedAt(LocalDateTime.now());
        article.setStats(new ArticleStats());
        article.setProcessed(false); // Important!

        articleRepository.save(article);
    }

    // ✅ STEP 2: Run AI processing on an existing article
    public void processExistingArticle(Article article) {
        try {
            // 1. Summarize (60 words)
            String summary = aiService.summarize(article.getOriginalContent());
            article.setSummary(summary);

            // 2. Embed (for vector search)
            List<Double> embedding = aiService.embed(article.getOriginalContent());
            article.setEmbedding(embedding);

            // 3. Mark as done
            article.setProcessed(true);
            Article saved = articleRepository.save(article);

            // 4. Notify users
            notificationService.createNotificationForCategory(
                article.getCategory(), article.getTitle(), saved.getId()
            );
            
            System.out.println("AI Processing complete for: " + article.getTitle());

        } catch (Exception e) {
            System.err.println("Error processing article " + article.getId() + ": " + e.getMessage());
        }
    }
}