package com.example.InfoByte.service;

import com.example.InfoByte.model.Article;
import com.example.InfoByte.model.UserInteraction;
import com.example.InfoByte.repository.ArticleRepository;
import com.example.InfoByte.repository.UserInteractionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InteractionService {

    private final UserInteractionRepository interactionRepository;
    private final ArticleRepository articleRepository;

    public InteractionService(UserInteractionRepository interactionRepository, 
                            ArticleRepository articleRepository) {
        this.interactionRepository = interactionRepository;
        this.articleRepository = articleRepository;
    }

    /**
     * Toggle like on an article
     */
    @Transactional
    public UserInteraction toggleLike(String userId, String articleId) {
        UserInteraction interaction = getOrCreateInteraction(userId, articleId);
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));

        if (interaction.isLiked()) {
            // Unlike
            interaction.setLiked(false);
            interaction.setLikedAt(null);
            article.getStats().decrementLikes();
        } else {
            // Like
            interaction.setLiked(true);
            interaction.setLikedAt(LocalDateTime.now());
            article.getStats().incrementLikes();
        }

        articleRepository.save(article);
        return interactionRepository.save(interaction);
    }

    /**
     * Toggle bookmark on an article
     */
    @Transactional
    public UserInteraction toggleBookmark(String userId, String articleId) {
        UserInteraction interaction = getOrCreateInteraction(userId, articleId);
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));

        if (interaction.isBookmarked()) {
            // Remove bookmark
            interaction.setBookmarked(false);
            interaction.setBookmarkedAt(null);
            article.getStats().decrementBookmarks();
        } else {
            // Add bookmark
            interaction.setBookmarked(true);
            interaction.setBookmarkedAt(LocalDateTime.now());
            article.getStats().incrementBookmarks();
        }

        articleRepository.save(article);
        return interactionRepository.save(interaction);
    }

    /**
     * Record a share
     */
    @Transactional
    public UserInteraction recordShare(String userId, String articleId) {
        UserInteraction interaction = getOrCreateInteraction(userId, articleId);
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));

        interaction.setShared(true);
        interaction.setSharedAt(LocalDateTime.now());
        article.getStats().incrementShares();

        articleRepository.save(article);
        return interactionRepository.save(interaction);
    }

    /**
     * Record that user viewed an article
     */
    @Transactional
    public UserInteraction recordView(String userId, String articleId, int readTimeSeconds) {
        UserInteraction interaction = getOrCreateInteraction(userId, articleId);
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new RuntimeException("Article not found"));

        interaction.setLastViewedAt(LocalDateTime.now());
        interaction.setViewCount(interaction.getViewCount() + 1);
        interaction.setReadTime(interaction.getReadTime() + readTimeSeconds);

        // Mark as read if spent more than 10 seconds
        if (readTimeSeconds > 10 && !interaction.isRead()) {
            interaction.setRead(true);
            interaction.setReadAt(LocalDateTime.now());
            article.getStats().incrementReads();
        }

        article.getStats().incrementViews();
        articleRepository.save(article);
        return interactionRepository.save(interaction);
    }

    /**
     * Get user's liked articles
     */
    public List<Article> getLikedArticles(String userId) {
        List<UserInteraction> interactions = interactionRepository.findByUserIdAndLikedTrue(userId);
        return getArticlesFromInteractions(interactions);
    }

    /**
     * Get user's bookmarked articles
     */
    public List<Article> getBookmarkedArticles(String userId) {
        List<UserInteraction> interactions = interactionRepository.findByUserIdAndBookmarkedTrue(userId);
        return getArticlesFromInteractions(interactions);
    }

    /**
     * Get user's read history
     */
    public List<Article> getReadHistory(String userId) {
        List<UserInteraction> interactions = interactionRepository.findByUserIdAndReadTrue(userId);
        return getArticlesFromInteractions(interactions);
    }

    /**
     * Get user's interaction status for an article
     */
    public UserInteraction getUserInteraction(String userId, String articleId) {
        return interactionRepository.findByUserIdAndArticleId(userId, articleId)
            .orElse(new UserInteraction()); // Return empty interaction if none exists
    }

    /**
     * Helper: Get or create interaction record
     */
    private UserInteraction getOrCreateInteraction(String userId, String articleId) {
        return interactionRepository.findByUserIdAndArticleId(userId, articleId)
            .orElseGet(() -> {
                UserInteraction newInteraction = new UserInteraction();
                newInteraction.setUserId(userId);
                newInteraction.setArticleId(articleId);
                return newInteraction;
            });
    }

    /**
     * Helper: Convert interactions to articles
     */
    private List<Article> getArticlesFromInteractions(List<UserInteraction> interactions) {
        List<String> articleIds = interactions.stream()
            .map(UserInteraction::getArticleId)
            .collect(Collectors.toList());
        
        return articleRepository.findAllById(articleIds);
    }
}
